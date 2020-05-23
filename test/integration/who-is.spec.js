'use strict';

const expect      = require('chai').expect;
const utils       = require('./utils');

describe('bacnet - whoIs integration', () => {
  it('should not invoke a event if no device is available', (next) => {
    const timeOutWithoutDevice = setTimeout(() => {
      client.close();
      next();
    }, 1000);
    const client = new utils.bacnetClient({apduTimeout: 200});
    client.on('iAm', (receiver, deviceId, maxApdu, segmentation, vendorId) => {
      client.close();
      expect(parseInt(receiver.payload.deviceId)).to.be.a('number'); // if there are device you'll get a response here
      clearTimeout(timeOutWithoutDevice);
      next();
    });
    client.whoIs();
  });
});
