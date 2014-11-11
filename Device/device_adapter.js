//
// Device API to control lumismart device
//
var bone = require('bonescript');
var fs = require('fs');
var tts = require('tts');
var u = require('underscore');
var exec = require('child_process').exec;
var options = {
        timeout: 1000,
        killSignal: 'SIGKILL'
};

//Load light sensor driver
var iic = '/sys/class/i2c-adapter/i2c-1/new_device';
// Light / Temperature / Humidity Sensor
var device_sensor_path = '/sys/bus/i2c/drivers/';

//Get light sensor value
var name_lightSensor = ''
var device_lightSensor = '/sys/bus/i2c/drivers/' + name_lightSensor;

//Get tempearture 
var name_tempSensor =''
var device_temperature = '/sys/bus/i2c/drivers/' + name_tempSensor;

//Get humidity
var name_humidSensor = ''
var device_humidity = '/sys/bus/i2c/drivers/' + name_humidSensor;

// Accelerometer Sensor
var zeroOffset  = 0.4584;
var conversionFactor = 0.0917;


// 
// Device Class
//
var Device = (function() {

    // methods
    // cb = function( info )
    Device.prototype.getInfo = function(cb) {
        info = {
            time: new Date,
            humidity: this.getHumidity(),
            temperature: this.getTemperature() 
        };
    
        this.getAccelerometer(function(x,y,z){
            info.accelerometer = {x:x,y:y,z:z};
            cb(info);
        });
    };

    // cb : function(x,y,z){}
    Device.prototype.getAccelerometer = function(cb) {
        ret = {}
        
        func = cb;
        var callADC = function(){
            bone.analogRead('P9_36', printX);
            bone.analogRead('P9_38', printY);
            bone.analogRead('P9_40', printZ);
        }

        var printX = function(x) {
            var value = (x.value - zeroOffset)/conversionFactor;
            ret.x = value;
            if ( ret.x && ret.y && ret.z ) {
                //console.log(ret)
                func(ret.x,ret.y,ret.z);
            }

        }
        var printY = function(x) {
            var value = (x.value - zeroOffset)/conversionFactor;
            ret.y = value;
            if ( ret.x && ret.y && ret.z ) {
                //console.log(ret)
                func(ret.x,ret.y,ret.z);
            }

        }
        var printZ = function(x) {
            var value = (x.value - zeroOffset)/conversionFactor;
            ret.z = value;
            if ( ret.x && ret.y && ret.z ) {
                //console.log(ret)
                func(ret.x,ret.y,ret.z);
            }

        }
        callADC();
    };

    Device.prototype.getTemperature = function() {
        var val = fs.readFileSync( device_temperature );
        val = val * 2.3;
        return parseFloat(val)
    };

    Device.prototype.getHumidity = function() {
        var val = fs.readFileSync( device_humidity );
        val = val / 1.48;
        return parseFloat(val)
    };

    // RGB Lamp RGB change
    Device.prototype.setRGBColor = function(r,g,b) {

        // r,g,b mapping to ( 0 ~ 31 )
        r = Math.floor( r / 255 * 31 );
        g = Math.floor( g / 255 * 31 );
        b = Math.floor( b / 255 * 31 );

        if( r == 0 && g == 0 && b == 0 ) {
            fs.writeFileSync( rgbled_turnoff, "1" );
        } else {
	    var temp_color = r+','+g+','+b ;
            // led on
            console.log('r = ' + r)
            //exec('echo ' + r + ' >> ' + rgbled_red );
            console.log('g = ' + g)
            //exec('echo ' + g + ' >> ' + rgbled_green)
            console.log('b = ' + b)
            //exec('echo ' + b + ' >> ' + rgbled_blue)
	    exec('echo ' + temp_color + ' >> ' + rgbled);
        }
    };
    

    // RGB Lamp RGB change
    Device.prototype.getRGBColor = function() {

       // r = fs.readFileSync( rgbled_red );
       // g = fs.readFileSync( rgbled_green );
       // b = fs.readFileSync( rgbled_blue );
        var temp_getcolor =  fs.readFileSync( rgbled );
	var rgb = temp_getcolor.split(','); 

        // r,g,b mapping to ( 0 ~ 255 )
        r = Math.floor(rgb[0] / 31 * 255);
        g = Math.floor(rgb[1] / 31 * 255);
        b = Math.floor(rgb[2] / 31 * 255);
        console.log( 'cur rgb ', r,g,b)
        return {r:r,g:g,b:b};
    };

 
    // White Lamp Turn on
    Device.prototype.turnLed = function(flag) {
        fs.writeFileSync( flag ? whiteled_turnon : whiteled_turnoff, '1' );
    };
    
    //Check White LED status
    Device.prototype.isTurnLED = function() {
        ret = fs.readFileSync( whiteled_isturnon );
        return parseInt( ret ) == 1;
    };
    
    return Device;

})();

var test_rgb_turnonoff = function() {
    dev = new Device;
    dev.turnRGBLamp(true);
    setTimeout(function(){
        dev.turnRGBLamp(false);
    },1000);
}

var test_control_led = function() {
    dev = new Device;
    dev.setLEDBright(0);
    dev.turnLed(true)
    for(var i = 0; i < 100; i+=10){
        dev.setLEDBright(i);
    }
}

var test_control_rgb = function() {
    dev = new Device;
    dev.turnRGBLamp(true)
    for(var i=0; i<256; i+=10){
        dev.setRGBColor(i,i,i);
    }
}

var test_sensor = function() {
    dev = new Device;
    dev.getInfo( function(info) {
        console.log(info);
    });

}

var test_rgb_setting = function() {
    dev = new Device;
    dev.setRGBColor(100,100,100);
    console.log(dev.getRGBColor())
}


exports.Device = Device


