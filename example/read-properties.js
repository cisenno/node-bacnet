'use strict';

const Bacnet = require('../index');

// you need to run the Weather2 Station of the YABE BACnet package
// https://sourceforge.net/projects/yetanotherbacnetexplorer/

// create instance of Bacnet
const bacnetClient = new Bacnet({apduTimeout: 10000, interface: '0.0.0.0'});

// emitted for each new message
bacnetClient.on('message', (msg, rinfo) => {
  console.log(msg);
  if (rinfo) console.log(rinfo);
});

// emitted on errors
bacnetClient.on('error', (err) => {
  console.error(err);
  bacnetClient.close();
});

// emmitted when Bacnet server listens for incoming UDP packages
bacnetClient.on('listening', () => {
  console.log('sent whoIs ' + Date.now());
  // discover devices once we are listening
  bacnetClient.whoIs();
});

// emitted when a new device is discovered in the network
bacnetClient.on('iAm', (device) => {
  console.log('Received iAm: ' + JSON.stringify(device, null, 4));
  // address object of discovered device,
  // just use in subsequent calls that are directed to this device
  const address = device.header.sender;

  //discovered device ID
  const deviceId = device.payload.deviceId;
  console.log('Found Device ' + deviceId + ' on ' + JSON.stringify(address));

  /*
    Depending on device this is the easier way to get all device
    properties, but might not be supported

    const requestArray = [{
      objectId: {type: 8, instance: deviceId},
      properties: [{id: 8}]
    }];
    bacnetClient.readPropertyMultiple(address, requestArray, (err, value) => {
      console.log(err);
      console.log('All properties: ', JSON.stringify(value));
    });
  */

  // Read only object-list property
  bacnetClient.readProperty(address, {type: 8, instance: deviceId}, 76, (err, value) => {
    console.log(err);
    console.log('value 76: ', JSON.stringify(value));
  });

});

setTimeout(() => {

  bacnetClient.close();
  console.log('closed transport ' + Date.now());

}, 30000); // do not close to fast

/*    it('read all properties 76 from device', (next) => {
      // Read Device Object
      const requestArray = [{
        objectId: {type: 1, instance: 2},
        properties: [{id: 8}]
      }];
      bacnetClient.readPropertyMultiple(address, requestArray, (err, value) => {
        console.log(err);
        console.log('All properties: ', JSON.stringify(value));
        next();
      });
    });

    it('read property 121 from device', (next) => {
      bacnetClient.readProperty(address, {type: 8, instance: 1234}, 76, (err, value) => {
        console.log(err);
        console.log('value 121: ', JSON.stringify(value));
        next();
      });
    });

    it('read property 121 from device', (next) => {
      bacnetClient.readProperty(address, {type: 8, instance: 1234}, 121, (err, value) => {
        console.log(err);
        console.log('value 121: ', JSON.stringify(value));
        next();
      });
    });


  it('read property 76-3 from device', (next) => {
    bacnetClient.readProperty(address, {type: 1, instance: 2}, 85, (err, value) => {
      console.log(err);
      console.log('value 76-1-2: ', JSON.stringify(value));
      next();
    });
  });
  /*
    it('read property 76-3 from device', (next) => {
      bacnetClient.subscribeProperty(address, {type: 5, instance: 2}, {id: 85, index: 4294967295}, 1000, false, false, (err, value) => {
        console.log(err);
        next();
      });
    });

  it('read property 76-3 from device', (next) => {
    bacnetClient.subscribeCov(address, {type: 5, instance: 2}, 107, false, false, 0, (err, value) => {
      console.log(err);
      next();
    });
  });


  it('read value 76-7 from device', (next) => {
    bacnetClient.readProperty(address, {type: 8, instance: 1234}, 85, {arrayIndex: 7}, (err, value) => {
      console.log(err);
      console.log('value 76-7: ', JSON.stringify(value));
      next();
    });
  });

  it('write value 76-7 to device', (next) => {
    bacnetClient.writeProperty(address, {type: 1, instance: 2}, 85, [
      {type: utils.bacnetClient.enum.ApplicationTags.REAL, value: 100}
    ], (err, value) => {
      console.log(err);
      console.log('value: ', JSON.stringify(value));
      next();
    });
  });

  it('read value 76-7 from device', (next) => {
    bacnetClient.readProperty(address, {type: 1, instance: 2}, 85, (err, value) => {
      console.log(err);
      console.log('value 76-7: ', JSON.stringify(value));
      next();
    });
  });

*/
