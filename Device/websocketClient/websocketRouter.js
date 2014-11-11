var util = require('../utilities.js');
var AdmZip = require('adm-zip');
var fs = require('fs');
var Device = require(util.LUMISMART_PATH+'/device.js').Device;
var domain = require('domain');

console.log("[WSRouter] initiated .. ");

module.exports = function() {
    var roomEnvClient = require(util.SENSORMANAGER_PATH+'/roomEnvApp.js'),
        appClient = require(util.LUMISMART_PATH+'/applicationManager.js');

    appClient.initialize();

    var device = new Device;

    var domain = require('domain');
    var axon = require('axon'),
        ipcMother = axon.socket('req'),
        ipcChild = axon.socket('rep');

    var ipcStartDate = Date.now(),
        ipcPastDate = ipcStartDate;

    var wsInstance = {};

    function runRoomEnvApplication() {
        var dExcept = domain.create(); // exception handling purpose.. 

        var mediaExec = require('child_process').exec,
            childExec;

        dExcept.on('error', function(err) {
            console.log(err);
        });

        dExcept.run(function() {

            childExec = mediaExec('node ../../Dev/lumismart/device/application/sensorManager/roomEnvApp.js', 
                function(error, stdout, stderr) {

                if(stdout) {
                  console.log('[sensor] media application executed, and running .. : ' + stdout);
                  return true;
                }

                if(stderr) {
                  console.log('[sensor] stderr occurrs .. : ' + stderr);
                  return false;
                }

                if (error) {
                  console.log('[sensor] exec error: ' + error);
                  return false;
                }
            });
        });
    }


    function setWebSocketInstance(instance) {
        console.log("setWebSocketInstance()");
        wsInstance = instance;
        appClient.setWebSocketConnectionCallback(sendMessageToServer);
        startDevice();
    }

    function sendMessageToServer(text) {
        if (wsInstance.connected) {
            wsInstance.sendUTF(JSON.stringify(text));
        } else {
            console.log("Web Socket is not connected.")
        }
    }

    function startDevice() {
        setInterval(function() {
            device.getInfo(
                function(info) {
                    var sensor = {'sensor' : info}; 
                    wsInstance.sendUTF(JSON.stringify(sensor));
                });
            }, 2000);
    }

    return {

        GetLuminanceInfo : function() {
        },

        GetRoomEnvInfo : function() {
            runRoomEnvApplication(); // gets temperature and humidity info..
        },

        setWebSocketInstance : function(instance) {
            setWebSocketInstance(instance);
        },

        sendMessageToServer : function(text) {
            sendMessageToServer(text);
        },

    }
} ();
