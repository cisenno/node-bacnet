'use strict';

const expect = require('chai').expect;
const utils = require('./utils');

// you need to run the Weather2 Station of the YABE BACnet package
// https://sourceforge.net/projects/yetanotherbacnetexplorer/
describe('bacstack - whoIs compliance', () => {
  let bacnetClient;

  beforeEach((done) => {
    bacnetClient = new utils.bacnetClient({apduTimeout: 1000, interface: '0.0.0.0'});
    console.log('open transport ' + Date.now());
    bacnetClient.on('message', (msg, rinfo) => {
      console.log(msg);
      if (rinfo) console.log(rinfo);
    });
    bacnetClient.on('error', (err) => {
      console.error(err);
      bacnetClient.close();
    });
    done();
  });

  afterEach((done) => {
    setTimeout(() => {
      bacnetClient.close();
      console.log('closed transport ' + Date.now());
      done();
    }, 3000); // do not close to fast
  });

  it('should find the device simulator', (next) => {
    bacnetClient.on('iAm', (device) => {
      console.log(device.payload.deviceId);
      expect(device.payload.deviceId).to.eql(1234);
      expect(device.payload.maxApdu).to.eql(1476);
      expect(device.payload.segmentation).to.eql(utils.bacnetClient.enum.Segmentation.NO_SEGMENTATION);
      expect(device.payload.vendorId).to.eql(260);
      next();
    });
    bacnetClient.whoIs();
    console.log('sent whoIs ' + Date.now());
  });

  it('should find the device simulator with provided min device ID', (next) => {
    bacnetClient.on('iAm', (device) => {
      console.log(device.payload.deviceId);
      expect(device.payload.deviceId).to.eql(1234);
      next();
    });
    bacnetClient.whoIs(1233);
    console.log('sent whoIs ' + Date.now());
  });

  it('should find the device simulator with provided min/max device ID and IP', (next) => {
    bacnetClient.on('iAm', (device) => {
      console.log(device.payload.deviceId);
      expect(device.payload.deviceId).to.eql(1234);
      next();
    });
    bacnetClient.whoIs(1233, 1235, 'bacnet-device');
    console.log('sent whoIs ' + Date.now());
  });
});
