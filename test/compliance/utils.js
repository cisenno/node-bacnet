'use strict';

const coreExports = {
  debug: require('debug')('bacnet:test:compliance:debug'),
  trace: require('debug')('bacnet:test:compliance:trace'),
  bacnetClient:  require('../../'),
  deviceUnderTest: 1234,
  maxApdu: 1476,
  vendorId: 260,
  index: 4294967295,
  apduTimeout: 1000,
  clientListenerInterface: '0.0.0.0'
};

module.exports = coreExports;
