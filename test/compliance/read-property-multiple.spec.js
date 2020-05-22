'use strict';

const expect = require('chai').expect;
const utils = require('./utils');

// you need to have this run against the official backstack c
// demo device started as deviceId 1234
// use "npm run docker" to execute this
describe('bacnet - readPropertyMultiple compliance', () => {
  let bacnetClient;
  let discoveredAddress;
  let onClose = null;

  before((done) => {
    bacnetClient = new utils.bacnetClient({apduTimeout: 1000, interface: '0.0.0.0'});
    bacnetClient.on('message', (msg, rinfo) => {
      console.log(msg);
      if (rinfo) console.log(rinfo);
    });
    bacnetClient.on('error', (err) => {
      console.error(err);
      bacnetClient.close();
    });
    bacnetClient.on('listening', () => {
      done();
    });
  });

  after((done) => {
    setTimeout(() => {
      bacnetClient.close();
      if (onClose) {
        onClose(done);
      } else {
        done();
      }
    }, 1000); // do not close to fast
  });

  it('should find the device simulator device', (next) => {
    bacnetClient.on('iAm', (device) => {
      expect(device.payload.deviceId).to.eql(1234);
      discoveredAddress = device.header.sender;
      next();
    });
    bacnetClient.whoIs();
  });

  it('read all properties from invalid device, expect errors in response', (next) => {
    // Read complete Device Object
    const requestArray = [{
      objectId: {type: 8, instance: 1235},
      properties: [{id: 8}]
    }];
    bacnetClient.readPropertyMultiple(discoveredAddress, requestArray, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value.values).to.be.an('array');
      expect(value.values[0]).to.be.an('object');
      expect(value.values[0].objectId).to.deep.equal({"type":8,"instance":1235});
      expect(value.values[0].values).to.be.an('array');
      expect(value.values[0].values[0]).to.deep.equal({"id":75,"index":4294967295,"value":[{"type":105,"value":{"errorClass":1,"errorCode":31}}]});
      next();
    });
  });

  it('read all properties from device, use discovered device address object', (next) => {
    // Read complete Device Object
    const requestArray = [{
      objectId: {type: 8, instance: 1234},
      properties: [{id: 8}]
    }];
    bacnetClient.readPropertyMultiple(discoveredAddress, requestArray, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value.values).to.be.an('array');
      expect(value.values[0]).to.be.an('object');
      expect(value.values[0].objectId).to.deep.equal({"type":8,"instance":1234});
      expect(value.values[0].values).to.be.an('array');
      expect(value.values[0].values[0]).to.deep.equal({"id":75,"index":4294967295,"value":[{"value":{"type":8,"instance":1234},"type":12}]});
      next();
    });
  });

  it('read all properties from device, use discovered device address as IP', (next) => {
    // Read complete Device Object
    const requestArray = [{
      objectId: {type: 8, instance: 1234},
      properties: [{id: 8}]
    }];
    bacnetClient.readPropertyMultiple(discoveredAddress.address, requestArray, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value.values).to.be.an('array');
      expect(value.values[0]).to.be.an('object');
      expect(value.values[0].objectId).to.deep.equal({"type":8,"instance":1234});
      expect(value.values[0].values).to.be.an('array');
      expect(value.values[0].values[0]).to.deep.equal({"id":75,"index":4294967295,"value":[{"value":{"type":8,"instance":1234},"type":12}]});
      next();
    });
  });

  it('read all properties from analog-output,2 of simulator device', (next) => {
    // Read complete Device Object
    const requestArray = [{
      objectId: {type: 1, instance: 2},
      properties: [{id: 8}]
    }];
    bacnetClient.readPropertyMultiple(discoveredAddress, requestArray, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value.values).to.be.an('array');
      expect(value.values[0]).to.be.an('object');
      expect(value.values[0].objectId).to.deep.equal({"type":1,"instance":2});
      expect(value.values[0].values).to.be.an('array');
      expect(value.values[0].values[0]).to.deep.equal({"id":75,"index":4294967295,"value":[{"value":{"type":1,"instance":2},"type":12}]});
      expect(value.values[0].values[1]).to.deep.equal({"id":77,"index":4294967295,"value":[{"value":"ANALOG OUTPUT 2","type":7,"encoding":0}]});
      next();
    });
  });

  it('read all properties from device, use broadcast', (next) => {
    // Read complete Device Object
    const requestArray = [{
      objectId: {type: 8, instance: 1234},
      properties: [{id: 8}]
    }];
    bacnetClient.readPropertyMultiple(null, requestArray, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value.values).to.be.an('array');
      expect(value.values[0]).to.be.an('object');
      expect(value.values[0].objectId).to.deep.equal({"type":8,"instance":1234});
      expect(value.values[0].values).to.be.an('array');
      expect(value.values[0].values[0]).to.deep.equal({"id":75,"index":4294967295,"value":[{"value":{"type":8,"instance":1234},"type":12}]});
      next();
    });
  });

  // TODO tests missing for routing cases where "receiver" parameter is used to call whoIs
});
