//
// Device API to control lumismart device
//
var fs = require('fs');
var u = require('underscore');
var exec = require('child_process').exec;
var options = {
        timeout: 1000,
        killSignal: 'SIGKILL'
};

// 
// Device Class
//
var Device = (function() {

    function Device() {
    }

    // methods
    // cb = function( info )
    Device.prototype.getInfo = function(cb) {
        info = {
            time: new Date,
            illuminance: this.getIlluminance(),
            humidity: this.getHumidity(),
            temperature: this.getTemperature() ,
            accelerometer: {x:1.0, y:1.0, z: 1.0}
        };
        cb(info);
    };


    Device.prototype.getIlluminance = function() {
        return 10;
    };

    Device.prototype.getTemperature = function() {
        return Math.floor(Math.random()*5+ 20);
    };

    Device.prototype.getHumidity = function() {
        return Math.floor(Math.random()*20 + 40);
    };

    // RGB Lamp RGB change
    Device.prototype.setRGBColor = function(r,g,b) {
        console.log('rgb = (' + r + ", " + g + ", " + b + ")" );
    };
    
    Device.prototype.turnRGBLamp = function(flag) {
        console.log('turnRGBLamp = ' + flag);
    }

    // RGB Lamp RGB change
    Device.prototype.getRGBColor = function() {
        console.log( 'cur rgb ', r,g,b)
        return {r:20,g:20,b:20};
    };

    //Check RGB LED status
    Device.prototype.isTurnRGBLamp = function() {
        return true;
    };
 
    // White Lamp Turn on
    Device.prototype.turnLed = function(flag) {
        console.log('turnLed = ' + flag);
    };
    
    //range: 0 ~ 100
    Device.prototype.setLEDBright = function(bright) {
        console.log('setLEDBright = ' + bright );
    };

    //Check White LED status
    Device.prototype.isTurnLED = function() {
        return true;
    };
    
    // TTS
    Device.prototype.tts = function(msg) {
        console.log('play tts');
    };

    return Device;

})();



exports.Device = Device


