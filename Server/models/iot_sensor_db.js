

var orm = require('orm')
module.exports = function(db) {

    var User = db.define('users', {
        email: String,
        provider: String,
        uid: String,
        token: String,
        token_secret: String,
        token_expires_at: Date,
        kind: String
    },{
        methods: {
            device_by_id: function(dev_id, callback) {
                Device.find({user_id: this.id, id: dev_id}, function(err, devices) {
                    if(devices.length == 1) {
                        callback(null, devices[0]);
                    } else {
                        callback(err, null);
                    }
                });
            }
        },
        validations:{}
    });


    var AuthToken = db.define('auth_tokens', {
        token: String
    }, {
        methods: {},
        validations: {}
    });

    AuthToken.user_from_token = function(token, cb) {
        AuthToken.find({token: token}, function(err, authtokens) {
            if( err || authtokens.length == 0){
                cb(null);
            } else {
                authtokens[0].getUser(function(err, user) {
                    if( err || user == null) {
                        cb(null);
                    } else {
                        cb(user)
                    }
                });
            }
        });
    };

    AuthToken.verify = function( token, cb) {
        AuthToken.find({token: token}, function(err, authtokens) {
            if( err || authtokens.length == 0){
                cb(false);
            } else {
                cb(true);
            }
        });
    };

    AuthToken.hasOne('user', User, {reverse: 'authTokens'})


    // Device
    //
    // * Class Method
    // - find([ conditions ] [, options ] [, limit ] [, order ] [, cb ])
    // - get(id, [ options ], cb)
    // - count([ conditions, ] cb)
    // - exists([ conditions, ] cb)
    //
    // * Method
    // - getUser( cb )
    // - setUser( user, cb )
    // - hasUser( cb )
    // - removeUser()
    // - device_sensor( cb )
    // - device_setting( cb )
    //
    // @ref https://github.com/dresende/node-orm2#modelgetid--options--cb

    var Device = db.define('devices', {
        udid: String,
        status: String,
        title: String
    },{
        methods: {
            getSensor: function(cb) {
                DeviceSensor.get( this.id, cb );
            },
            getSetting: function(cb) {
                DeviceSetting.get( this.id, cb );
            }
        }
    });

    Device.hasOne('user', User, {reverse: 'devices'});

    // DeviceSensor
    //
    // * Class Method
    // - find([ conditions ] [, options ] [, limit ] [, order ] [, cb ])
    // - get(id, [ options ], cb)
    // - count([ conditions, ] cb)
    // - exists([ conditions, ] cb)
    //
    // * Method
    // - getDevice( cb )
    // - setDevice( device, cb )
    // - hasDevice( cb )
    // - removeDevice()
    //
    // @ref https://github.com/dresende/node-orm2#modelgetid--options--cb

    var DeviceSensor = db.define('device_sensors', {
        device_id: Number,
        lux: Number,
        temperature: Number,
        humidity: Number,
        acceleration: String,
        connected: Boolean,
        created_at: Date,
        updated_at: Date
    });

    DeviceSensor.hasOne('device', Device);

    // DeviceSetting
    //
    // * Class Method
    // - find([ conditions ] [, options ] [, limit ] [, order ] [, cb ])
    // - get(id, [ options ], cb)
    // - count([ conditions, ] cb)
    // - exists([ conditions, ] cb)
    //
    // * Method
    // - getDevice( cb )
    // - setDevice( device, cb )
    // - hasDevice( cb )
    // - removeDevice()
    //
    // @ref https://github.com/dresende/node-orm2#modelgetid--options--cb

    var DeviceSetting = db.define('device_settings', {
        device_id: Number,
        led_brightness: Number,
        led_on: Boolean,
        // this value is encoded below
        //
        // r,g,b
        //
        // ex) 255,255,255 
        led_rgb: String
    });

    DeviceSetting.hasOne('device', Device);

    // export models
    var models = {
        User: User,
        AuthToken: AuthToken,
        Device: Device,
        DeviceSensor: DeviceSensor,
        DeviceSetting: DeviceSetting,
    }
    return models;
};
