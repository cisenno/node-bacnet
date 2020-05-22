'use strict';

const expect      = require('chai').expect;
const utils       = require('./utils');

describe('bacnet - whoIs integration', () => {
  it('should not invoke a event if no device is available', (next) => {
    const client = new utils.bacnetClient({apduTimeout: 200});
    client.on('iAm', (receiver, deviceId, maxApdu, segmentation, vendorId) => {
      client.close();
      next(new Error('Unallowed Callback from receiver: ' + receiver.payload + ' deviceId:' + deviceId));
    });
    setTimeout(() => {
      client.close();
      next();
    }, 300);
    client.whoIs();
  });
});
