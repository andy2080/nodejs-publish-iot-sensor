
var os = require('os')
var Device = null;
if ( os.platform() == 'darwin' ){
    Device = require('./device_virtual').Device;
} else {
    Device = require('./device_virtual_ex').Device;
}

exports.Device = Device;
