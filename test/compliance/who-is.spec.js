'use strict';

const expect  = require('chai').expect;
const utils   = require('./utils');

describe('bacstack - whoIs compliance', () => {
  let bacnetClient;

  beforeEach(() => bacnetClient = new utils.bacnetClient({apduTimeout: 1000}));
  afterEach(() => bacnetClient.close());

  it('should find the device simulator', (next) => {
    bacnetClient.on('iAm', (device) => {
      expect(device.deviceId).to.eql(1234);
      expect(device.maxApdu).to.eql(1476);
      expect(device.segmentation).to.eql(bacnet.enum.Segmentation.NO_SEGMENTATION);
      expect(device.vendorId).to.eql(260);
      next();
    });
    bacnetClient.whoIs();
  });

  it('should find the device simulator with provided min device ID', (next) => {
    bacnetClient.on('iAm', (device) => {
      expect(device.deviceId).to.eql(1234);
      next();
    });
    bacnetClient.whoIs(1233);
  });

  it('should find the device simulator with provided min/max device ID and IP', (next) => {
    bacnetClient.on('iAm', (device) => {
      expect(device.deviceId).to.eql(1234);
      next();
    });
    bacnetClient.whoIs(1233, 1235, 'bacnet-device');
  });
});
