

var WebSocketClient = require('websocket').client;
var wsRouter = require('./websocketRouter.js');
var fs = require('fs');

var BufferReadStream = require('streamers').BufferReadStream;

var Stream = require('stream').Stream;
var client = new WebSocketClient();

var protoIdentity = 'iot-sensor-protocol'

function init() {
client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket client connected');
    
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log(protoIdentity + ' Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
            
            //routeDataCategory(message.utf8Data);
            var iotSensorObj = JSON.parse(message.utf8Data); // this is for the app launch state only
            if ("id" in iotSensorObj) {
                console.log("[DQ]" + iotSensorObj.id);                
            }
        }
    });

    function updateApplicationState(appID) {
        // updates application run state..
        wsRouter.UpdateApplicationState(appID);
    }

    function requestAppDownload(appID) {
        wsRouter.StartDownload(appID);
    }

    function routeDataCategory(category) {

        switch(category) {
            case "temperature":
            case "humidity":
            {
                wsRouter.GetRoomEnvInfo();
                break;
            }
            case "luminance":
            {
                wsRouter.GetLuminanceInfo();
                break;
            }
            default:
                break;
        }
    }

    function sendDummyText() {
        if (connection.connected) {
            var myMessage = "Hola!";
            connection.sendUTF(myMessage.toString());

            connection.sendUTF(JSON.stringify({
              to: "client2",
              data: "foo"
            }));
        }
    }
    sendDummyText();
});


client.connect('ws://localhost:8080/', protoIdentity); // limited protocol access.. 
}

module.exports = init;
