'use strict';

const expect = require('chai').expect;
const utils = require('./utils');

// you need to have this run against the official backstack c
// demo device started as deviceId 1234
// use "npm run docker" to execute this
describe('bacnet - writeProperty compliance', () => {
  let bacnetClient;
  let discoveredAddress;
  let onClose = null;

  before((done) => {
    bacnetClient = new utils.bacnetClient({apduTimeout: utils.apduTimeout, interface: utils.clientListenerInterface});
    bacnetClient.on('message', (msg, rinfo) => {
      debug(msg);
      if (rinfo) debug(rinfo);
    });
    bacnetClient.on('iAm', (device) => {
      discoveredAddress = device.header.sender;
    });
    bacnetClient.on('error', (err) => {
      console.error(err);
      bacnetClient.close();
    });
    bacnetClient.on('listening', () => {
      done();
    });
  });

  after((done) => {
    setTimeout(() => {
      bacnetClient.close();
      if (onClose) {
        onClose(done);
      } else {
        done();
      }
    }, 1000); // do not close to fast
  });

  it('should find the device simulator device', (next) => {
    bacnetClient.on('iAm', (device) => {
      if(device.payload.deviceId === utils.deviceUnderTest) {
        discoveredAddress = device.header.sender;
        expect(device.payload.deviceId).to.eql(utils.deviceUnderTest);
        expect(discoveredAddress).to.be.an('object');
        expect(discoveredAddress.address).to.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
        next();
      }
    });
    bacnetClient.whoIs();
  });

  it('read property PRESENT_VALUE from analog-output,2 from device', (next) => {
    bacnetClient.readProperty(discoveredAddress, {type: 1, instance: 2}, 85, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value).to.deep.equal({'len':14,'objectId':{'type':1,'instance':2},'property':{'id':85,'index': utils.index},'values':[{'type':4,'value':0}]});
      next();
    });
  });

  it('write property PRESENT_VALUE from analog-output,2 from device', (next) => {
    bacnetClient.writeProperty(discoveredAddress, {type: 1, instance: 2}, 85, [
      {type: utils.bacnetClient.enum.ApplicationTags.REAL, value: 100}
    ], (err) => {
      expect(err).to.be.not.ok;
      next();
    });
  });

  it('read property PRESENT_VALUE from analog-output,2 from device, expect written value', (next) => {
    bacnetClient.readProperty(discoveredAddress, {type: 1, instance: 2}, 85, (err, value) => {
      expect(err).to.be.not.ok;
      expect(value).to.be.an('object');
      expect(value).to.deep.equal({'len':14,'objectId':{'type':1,'instance':2},'property':{'id':85,'index': utils.index},'values':[{'type':4,'value':100}]});
      next();
    });
  });

  // TODO tests missing for routing cases where "receiver" parameter is used to call whoIs
});
