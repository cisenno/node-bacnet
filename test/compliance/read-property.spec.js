'use strict';

const expect = require('chai').expect;
const utils = require('./utils');

// you need to have this run against the official backstack c
// demo device started as deviceId 1234
// use "npm run docker" to execute this
describe('bacnet - readProperty compliance', () => {
  let bacnetClient;
  let discoveredAddress;
  let onClose = null;

  before((done) => {
    bacnetClient = new utils.bacnetClient({apduTimeout: 1000, interface: '0.0.0.0'});
    bacnetClient.on('message', (msg, rinfo) => {
      console.log(msg);
      if (rinfo) console.log(rinfo);
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
      discoveredAddress = device.header.sender;
      expect(device.payload.deviceId).to.eql(1234);
      expect(discoveredAddress).to.be.an('object');
      expect(discoveredAddress.address).to.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
      next();
    });
    bacnetClient.whoIs();
  });

  it('read property VENDOR_NAME (121) from device', (next) => {
    bacnetClient.readProperty(discoveredAddress, {type: 8, instance: 1234}, 121, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value).to.deep.equal({"len":39,"objectId":{"type":8,"instance":1234},"property":{"id":121,"index":4294967295},"values":[{"type":7,"value":"BACnet Stack at SourceForge","encoding":0}]});
      next();
    });
  });

  it('read property PRESENT_VALUE from analog-output,2 from device', (next) => {
    bacnetClient.readProperty(discoveredAddress, {type: 1, instance: 2}, 85, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value).to.deep.equal({"len":14,"objectId":{"type":1,"instance":2},"property":{"id":85,"index":4294967295},"values":[{"type":4,"value":0}]});
      next();
    });
  });

  // TODO tests missing for routing cases where "receiver" parameter is used to call whoIs

  /*
  it('read property 76-3 from device', (next) => {
    bacnetClient.subscribeProperty(address, {type: 5, instance: 2}, {id: 85, index: 4294967295}, 1000, false, false, (err, value) => {
      console.log(err);
      next();
    });
  });

  it('read property 76-3 from device', (next) => {
    bacnetClient.subscribeCov(discoveredAddress, {type: 5, instance: 2}, 107, false, false, 0, (err, value) => {
      console.log(err);
      next();
    });
  });
*/
});
