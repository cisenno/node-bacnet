'use strict';

const expect = require('chai').expect;
const utils = require('./utils');

// you need to have this run against the official backstack c
// demo device started as deviceId 1234
// use "npm run docker" to execute this
describe('bacnet - subscribeProperty compliance', () => {
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

  it('subscribe property BINARY_VALUE,2 from device, expect not supported error', (next) => {
    bacnetClient.subscribeProperty(discoveredAddress, {type: 5, instance: 2}, {id: 85, index: 4294967295}, 1000, false, false, (err) => {
      expect(err).to.be.ok;
      expect(err.bacnetAbortReason).to.equal(utils.bacnetClient.enum.AbortReason.OUT_OF_RESOURCES); // 9
      next();
    });
  });

  // TODO tests missing for routing cases where "receiver" parameter is used to call whoIs

});
