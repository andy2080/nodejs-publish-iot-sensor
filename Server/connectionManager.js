
console.log("[NodeWAS] connectionManager started..!");

module.exports = function() {

  var domain = require('domain');

  var wsNodeServer = require('./websocketManager.js');

  var axon = require('axon'),
      wsSocket = axon.socket('req');

  function isCommunicationOn() {
    var dExcept = domain.create(); // exception handling purpose..  

    dExcept.on('error', function(err) {
      console.log(err);
    });
    dExcept.run(function() {
      wsSocket.send('Knock', function(res) {
        console.log(res);
      })
    });
  }

  function runWebSocketServer() {
    var dExcept = domain.create(); // exception handling purpose..     
    var wsChild = require('child_process'),
        wsSpawn = wsChild.spawn,
        wsFork = wsChild.fork(__dirname + '/websocketManager.js');

    dExcept.on('error', function(err) {
      console.log(err);
    });
    dExcept.run(function() {
      wsFork.on('message', function(msg) {
        console.log('Parent Got New Message : ', msg);
      });  

      wsFork.send({
        initDone : 'good!'
      });

      wsSocket.format('json');
      wsSocket.bind(8282);
      wsSocket.send('GetReady', function(res) {
        console.log(res);
      })
    });
  }


  function requestSwitchLED(deviceID, value) {
    var dExcept = domain.create(); // exception handling purpose..  

    dExcept.on('error', function(err) {
      console.log(err);
    });
    dExcept.run(function() {
      wsSocket.format('json');
      wsSocket.bind(8282);
      wsSocket.send('ReqSwitchLED', deviceID, value, function(res) {
          console.log('i got it');
      });
    });
  }

  function requestChangeRGBValues(deviceID, rgb) {
    var dExcept = domain.create(); // exception handling purpose..  

    dExcept.on('error', function(err) {
      console.log(err);
    });
    dExcept.run(function() {
      wsSocket.format('json');
      wsSocket.bind(8282);
      wsSocket.send('ReqChangeRGB', deviceID, rgb, function(res) {
          console.log('i got it');
      });
    });
  }


  function requestRGBUpdate(devID, rgb) {
    var dExcept = domain.create(); // exception handling purpose..  

    var done = devID;
    dExcept.on('error', function(err) {
      console.log(err);
    });
    dExcept.run(function() {
      wsSocket.format('json');
      wsSocket.bind(8282);
      wsSocket.send('ReqRGBUpdate', devID, appID, rgb, function(res) {

          console.log('i got it');

      });
    });  
  }

  }

  return {

    InitWebSocketServer : function () {
      runWebSocketServer();
    },

    ChangeRGBValues : function (devID, rgb) {
      requestChangeRGBValues(devID, rgb);
    },

    SwitchLED : function (deviceID, value) {

      if (typeof value === "boolean") {

        requestSwitchLED(deviceID, value);

      } else {

        console.log("[NodeWAS] switchLED type value unmatched");
        return;
      }
    }
  }
}();
