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
    bacnetClient = new utils.bacnetClient({apduTimeout: utils.apduTimeout, interface: utils.clientListenerInterface});
    bacnetClient.on('message', (msg, rinfo) => {
      debug(msg);
      if (rinfo) debug(rinfo);
    });
    bacnetClient.on('iAm', (device) => {
      discoveredAddress = device.header.sender;
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
      if(device.payload.deviceId === utils.deviceUnderTest) {
        discoveredAddress = device.header.sender;
        expect(device.payload.deviceId).to.eql(utils.deviceUnderTest);
        expect(discoveredAddress).to.be.an('object');
        expect(discoveredAddress.address).to.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
        next();
      }
    });
    bacnetClient.whoIs();
  });

  it('read all properties from invalid device, expect errors in response', (next) => {
    // Read complete Device Object
    const requestArray = [{
      objectId: {type: 8, instance: utils.deviceUnderTest +1},
      properties: [{id: 8}]
    }];
    bacnetClient.readPropertyMultiple(discoveredAddress, requestArray, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value.values).to.be.an('array');
      expect(value.values[0]).to.be.an('object');
      expect(value.values[0].objectId).to.deep.equal({'type':8,'instance': utils.deviceUnderTest +1});
      expect(value.values[0].values).to.be.an('array');
      expect(value.values[0].values[0]).to.deep.equal({'id':75,'index': utils.index,'value':[{'type':105,'value':{'errorClass':1,'errorCode':31}}]});
      next();
    });
  });

  it('read all properties from device, use discovered device address object', (next) => {
    // Read complete Device Object
    const requestArray = [{
      objectId: {type: 8, instance: utils.deviceUnderTest},
      properties: [{id: 8}]
    }];
    bacnetClient.readPropertyMultiple(discoveredAddress, requestArray, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value.values).to.be.an('array');
      expect(value.values[0]).to.be.an('object');
      expect(value.values[0].objectId).to.deep.equal({'type':8,'instance': utils.deviceUnderTest});
      expect(value.values[0].values).to.be.an('array');
      expect(value.values[0].values[0]).to.deep.equal({'id':75,'index': utils.index,'value':[{'value':{'type':8,'instance': utils.deviceUnderTest},'type':12}]});
      next();
    });
  });

  it('read all properties from device, use discovered device address as IP', (next) => {
    // Read complete Device Object
    const requestArray = [{
      objectId: {type: 8, instance: utils.deviceUnderTest},
      properties: [{id: 8}]
    }];
    bacnetClient.readPropertyMultiple(discoveredAddress.address, requestArray, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value.values).to.be.an('array');
      expect(value.values[0]).to.be.an('object');
      expect(value.values[0].objectId).to.deep.equal({'type':8,'instance': utils.deviceUnderTest});
      expect(value.values[0].values).to.be.an('array');
      expect(value.values[0].values[0]).to.deep.equal({'id':75,'index': utils.index,'value':[{'value':{'type':8,'instance': utils.deviceUnderTest},'type':12}]});
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
      expect(value.values[0].objectId).to.deep.equal({'type':1,'instance': 2});
      expect(value.values[0].values).to.be.an('array');
      expect(value.values[0].values[0]).to.deep.equal({'id':75,'index': utils.index,'value':[{'value':{'type':1,'instance': 2},'type':12}]});
      expect(value.values[0].values[1]).to.deep.equal({'id':77,'index': utils.index,'value':[{'value':'ANALOG OUTPUT 2','type':7,'encoding':0}]});
      next();
    });
  });

  it('read all properties from device, use broadcast', (next) => {
    // Read complete Device Object
    const requestArray = [{
      objectId: {type: 8, instance: utils.deviceUnderTest},
      properties: [{id: 8}]
    }];
    bacnetClient.readPropertyMultiple(null, requestArray, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value.values).to.be.an('array');
      expect(value.values[0]).to.be.an('object');
      expect(value.values[0].objectId).to.deep.equal({'type':8,'instance': utils.deviceUnderTest});
      expect(value.values[0].values).to.be.an('array');
      expect(value.values[0].values[0]).to.deep.equal({'id':75,'index': utils.index,'value':[{'value':{'type':8,'instance': utils.deviceUnderTest},'type':12}]});
      next();
    });
  });

  // TODO tests missing for routing cases where "receiver" parameter is used to call whoIs
});
