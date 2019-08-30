'use strict';

const bacnet            = require('../../');

module.exports.bacnetClient = bacnet;

module.exports.getBuffer = () => {
  return {
    buffer: Buffer.alloc(1482),
    offset: 0
  };
};
