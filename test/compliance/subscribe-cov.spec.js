'use strict';

const expect = require('chai').expect;
const utils = require('./utils');

// you need to have this run against the official backstack c
// demo device started as deviceId 1234
// use "npm run docker" to execute this
describe('bacnet - subscribeCov compliance', () => {
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

  it('subscribeCov property BINARY_VALUE,2 from device, expect error OPTIONAL_FUNCTIONALITY_NOT_SUPPORTED', (next) => {
    bacnetClient.subscribeCov(discoveredAddress, {type: 5, instance: 2}, 107, false, false, 0, (err) => {
      expect(err).to.be.ok;
      expect(err.bacnetErrorClass).to.equal(utils.bacnetClient.enum.ErrorClass.OBJECT); // 1
      expect(err.bacnetErrorCode).to.equal(utils.bacnetClient.enum.ErrorCode.OPTIONAL_FUNCTIONALITY_NOT_SUPPORTED); // 45
      next();
    });
  });

  // TODO tests missing for routing cases where "receiver" parameter is used to call whoIs

});
