'use strict';

const expect = require('chai').expect;
const utils = require('./utils');

describe('bacstack - whoIs compliance', () => {

  let bacnetClient;
  let iamFunction = () => { 
    console.log('default iAm event') 
  };

  beforeEach((done) => {
    bacnetClient = new utils.bacnetClient({ apduTimeout: 1000 });
    console.log('open transport ' + Date.now());
    bacnetClient.on('iAm', iamFunction);
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
    }, 2000); // do not close to fast
  });

  it('should find the device simulator', (next) => {
    iamFunction = (device) => {
      console.log(device.deviceId);
      expect(device.deviceId).to.eql(1234);
      // expect(device.maxApdu).to.eql(1476);
      // expect(device.segmentation).to.eql(bacnet.enum.Segmentation.NO_SEGMENTATION);
      // expect(device.vendorId).to.eql(260);
      next();
    };
    bacnetClient.whoIs();
    console.log('sent whoIs ' + Date.now());
  }).timeout(3000);

  it('should find the device simulator with provided min device ID', (next) => {
    iamFunction = (device) => {
      console.log(device.deviceId);
      expect(device.deviceId).to.eql(1234);
      next();
    };
    bacnetClient.whoIs(1233);
    console.log('sent whoIs ' + Date.now());
  }).timeout(3000);

  it('should find the device simulator with provided min/max device ID and IP', (next) => {
    iamFunction = (device) => {
      console.log(device.deviceId);
      expect(device.deviceId).to.eql(1234);
      next();
    };
    bacnetClient.whoIs(1233, 1235, 'bacnet-device');
    console.log('sent whoIs ' + Date.now());
  }).timeout(3000);
});
