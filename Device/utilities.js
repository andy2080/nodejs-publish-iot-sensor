var utilities = {};

/**
 * ROOT_PATH
 */
utilities.ROOT_PATH = __dirname;


/**
 * CONFIGSERVER_PATH
 */
utilities.CONFIGSERVER_PATH
    = utilities.ROOT_PATH + '/configManager';

/**
 * WEBSOCKETCLIENT_PATH
 */
utilities.WEBSOCKETCLIENT_PATH
    = utilities.ROOT_PATH + '/websocketClient';

/**
 *
 */
utilities.deleteFolderRecursive = function (path) {
    var fs = require('fs');
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};


/**
 * export this instance
 */
module.exports = utilities;