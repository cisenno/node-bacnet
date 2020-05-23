'use strict';

const expect      = require('chai').expect;
const utils       = require('./utils');

describe('bacnet - timeSync integration', () => {
  it('should send a time sync package', () => {
    const client = new utils.bacnetClient({apduTimeout: 200});
    client.timeSync('127.0.0.2', new Date());
    client.close();
  });
});
