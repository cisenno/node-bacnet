'use strict';

const expect = require('chai').expect;
const utils = require('./utils');

// you need to have this run against the official backstack c
// demo device started as deviceId 1234
// use "npm run docker" to execute this
describe('bacnet - writeProperty compliance', () => {
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

  it('read property PRESENT_VALUE from analog-output,2 from device', (next) => {
    bacnetClient.readProperty(discoveredAddress, {type: 1, instance: 2}, 85, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value).to.deep.equal({"len":14,"objectId":{"type":1,"instance":2},"property":{"id":85,"index":4294967295},"values":[{"type":4,"value":0}]});
      next();
    });
  });

  it('write property PRESENT_VALUE from analog-output,2 from device', (next) => {
    bacnetClient.writeProperty(discoveredAddress, {type: 1, instance: 2}, 85, [
      {type: utils.bacnetClient.enum.ApplicationTags.REAL, value: 100}
    ], (err) => {
      expect(err).to.be.not.ok;
      next();
    });
  });

  it('read property PRESENT_VALUE from analog-output,2 from device, expect written value', (next) => {
    bacnetClient.readProperty(discoveredAddress, {type: 1, instance: 2}, 85, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value).to.deep.equal({"len":14,"objectId":{"type":1,"instance":2},"property":{"id":85,"index":4294967295},"values":[{"type":4,"value":100}]});
      next();
    });
  });

  // TODO tests missing for routing cases where "receiver" parameter is used to call whoIs
});
