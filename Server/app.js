
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var orm = require("orm");
var app_setting = require('./app_setting');

var restapi = require('./routes/restful');
var app = express();


// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(orm.express(app_setting.db_addr, {
    define: function (db, models, next) {
        iot_sensor_db = require('./models/iot_sensor_db')(db);
        models.User = iot_sensor_db.User;
        models.AuthToken = iot_sensor_db.AuthToken;
        models.Device = iot_sensor_db.Device;
        models.DeviceSensor = iot_sensor_db.DeviceSensor;
        models.InstalledApp = iot_sensor_db.InstalledApp;
        next();
    }
}));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.put('/api/v1/mydevices/:id/led', restapi.led);

if ('smartswitch' === personality) {
    // initialize app manager
    var nodeAppMgr = require('./nodeAppMgr/nodeAppMgr');

    // initialize db
    nodeAppMgr.initialize(function() {
        nodeAppMgr.start();
    });

    // set web service
    app.get('/api/v1/app/:id/launch', restapi.smartswitch.launchApp);
    app.get('/api/v1/app/:id/terminate', restapi.smartswitch.terminateApp);
    app.get('/api/v1/port', restapi.smartswitch.getPort);
    app.get('/api/v1/cleanup', restapi.smartswitch.cleanup);
}

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


// keep server alive even though exception occurs in server
// code from http://nodeqa.com/nodejs_ref/1
process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err.stack);
});

