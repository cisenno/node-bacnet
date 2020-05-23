'use strict';

const expect      = require('chai').expect;
const utils       = require('./utils');

describe('bacnet - timeSyncUTC integration', () => {
  it('should send a time UTC sync package', () => {
    const client = new utils.bacnetClient({apduTimeout: 200});
    client.timeSyncUTC('127.0.0.2', new Date());
    client.close();
  });
});
