

/*SETTING UP DEPENDENCIES*/
var Hapi = require('hapi');
var Path = require('path');
var Good = require('good');

/*CREATE HAPI SERVER --- http://hapijs.com/
* set ejs as template system */
var port = parseInt(process.env.PORT, 10) || 8080;
var server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: port
});
server.views({
    engines: {
        html: require('ejs')
    },
    path: './views'
});


var $ = require('./global');
$.put('test', 'OK');
$.put('server', server);
$.put('fsmanager', require('./server_modules/fsmodule')($)); //file system manager
$.put('storify', require('./server_modules/storify')($)); // utility methods (import kml, pics and so on)



var options = {
    reporters: [{
        reporter: require('good-console'),
        events: { log: ['error', 'medium'] }
    }]
};
server.register({
    register: require('good'),
    options: options
}, function (err) {
    if (err) {
        console.error(err);
    }
    else {
        server.start(function () {
            console.info('Server started at ' + server.info.uri);
        });
    }
});
require('./routes/main')($);