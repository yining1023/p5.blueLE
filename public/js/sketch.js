// IPAddress defaults to localhost, like serial.
// port defaults to 9000
var ble;
var IPAddress = 'localhost',
    port = 9000;

var peripherals = []; // a list of peripherals resulting from a scan
var peripheral;      // the peripheral that the user wants
// this can be populated by searching the list for a known service UUID, or
// by running a filtered scan for the UUID

var scanButton;

function setup() {
  var ble = new p5.BluetoothLE(IPAddress, port);
  // When a client connects to the bleControl app, it can then:
  ble.startScanning();            // scan for all peripherals
  // ble.startScanning([uuids]);     // filtered scan for a known UUID
  // ble.list();                     // list all available devices, returns an array of device UUIDs
}



// once the desired peripheral is known, the user can do these
// most are inherited directly from noble except where commented:
// peripheral.connect();
// peripheral.disconnect();
// peripheral.discover();                // masks noble.discoverAllServicesAndCharacteristics
// peripheral.discoverServices();
// peripheral.discoverCharacteristics();

// once the user has a characteristic, they can do these
// again, adapted mostly from noble):
// characteristic.read();               // direct from noble
// characteristic.readString();      // converts read() buffer to Strinb
// characteristic.readNumber();   // converts read() butter to Number
// characteristic.write();               // convert all data to Buffer before passing to noble
// characteristic.subscribe();
// characteristic.unsubscribe();
// characteristic.on('data', callback);

// other noble functions allowed as written

// scanButton = select("#scan");
// scanButton.mousePressed(function() {
//   ble.startScanning();
//   console.log('button pressed');
// });