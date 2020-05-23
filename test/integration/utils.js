'use strict';

const coreExports = {
  debug: require('debug')('bacnet:test:integration:debug'),
  trace: require('debug')('bacnet:test:integration:trace'),
  bacnetClient:  require('../../')
};

module.exports = coreExports;

const EventEmitter      = require('events').EventEmitter;

class Transport extends EventEmitter {
  constructor() {
    super();
  }
  getBroadcastAddress() {
    return '255.255.255.255';
  }
  getMaxPayload() {
    return 1482;
  }
  send() { }
  open() { }
  close() { }
}
module.exports.transportStub = Transport;

module.exports.propertyFormater = (object) => {
  const converted = {};
  object.forEach(property => converted[property.id] = property.value);
  return converted;
};
