
console.log("[SysManager] Lumismart System Manager..!!");


var util = require('../utilities.js');

var WebSocketClient = require('websocket').client;
var wsRouter = require(util.WEBSOCKETCLIENT_PATH+'/websocketRouter.js');
var fs = require('fs');

var Stream = require('stream').Stream;
var client = new WebSocketClient();
var Device = require('../device').Device;
var sensorDevice = new Device;

var serialNumber = "A1000000"  
var protoIdentity = 'iot-sensor-protocol'
var directUrl = 'ws://localhost:5000/'

function connectionRetry() {
    console.log('[WSClient] connection retry to server ..');
    client.connect(directUrl, protoIdentity, serialNumber); // limited protocol access.. 
}

process.on('SIGINT', function() {
    console.log('[SysManager] Got SIGINT.  Press Control-D to exit.');

});

process.on('SIGHUP', function() {
  console.log('Got SIGHUP signal.');
	
	bootAgent.ExitBootAgent();
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err.stack);
});

client.on('connectFailed', function(error) {
    setTimeout(connectionRetry, 5000);
});

var RETRY_TRY_DONE = false;
var TIMEOUT_ID = "";
client.on('connect', function(connection) {

    clearTimeout(TIMEOUT_ID);
    RETRY_TRY_DONE = true;
    console.log('WebSocket client connected');

    wsRouter.setWebSocketInstance(connection);

    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {

        TIMEOUT_ID = setTimeout(connectionRetry, 5000);  
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");

            var iotSenserObj = JSON.parse(message.utf8Data); // this is for the app launch state only
            if ("id" in iotSenserObj) {
                
                switch (iotSenserObj.id)
                {
                    case "SWITCH_LED":
                        requestSwithLed( iotSenserObj.data );
                        break;
                    case "GET_TEMPERATURE":
                        getTemperature();
                        break;
                    case "GET_HUMIDITY":
                        getHumidity();
                        break;
                    case "CHANGE_RGB":
                        rgb = iotSenserObj.data
                        requestChangeRGB(rgb[0],rgb[1],rgb[2]);
                        break;
                }   
            } else {
                console.log("[DQ]" + message.utf8Data);
            }
        }
    });


    function requestSwithLed( onoff ) {
        if( onoff == true ){
            // on
            sensorDevice.turnLed(true);
            sensorDevice.setLEDBright( 80 );
            sensorDevice.turnRGBLamp(false );
        } else {
            // off
            sensorDevice.turnLed(false);
            sensorDevice.turnRGBLamp(false );
        }
    }

    function getTemperature() {
    }

    function getHumidity() {
    }

    function requestChangeRGB(r,g,b) {
        sensorDevice.turnRGBLamp(true);
        sensorDevice.setRGBColor(r,g,b);
    }

});

client.connect(directUrl, protoIdentity, serialNumber); 

setTimeout(function() {
    console.log('[SysMaganer] Exiting...... ');
    //process.exit(0);
}, 100);

setTimeout(
    function() {
        console.log("[SysManager] Application booting succeeded..");	
    }, 5000
);

// Keep alive
setInterval(
    function() {
        console.log("[SysManager] working....");
    }, 10000
);

