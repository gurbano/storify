module.exports = function($) {
    var server = $.get('server');
     server.route({
        method: 'GET',
        path: '/',
        handler: {
            view: 'index'
        }
    });
    server.route({
        method: 'GET',
        path: '/index',
        handler: {
            view: 'index'
        }
    });
     server.route({
        method: 'GET',
        path: '/edit',
        handler: {
            view: 'edit'
        }
    });
    server.route({
        method: 'GET',
        path: '/lib/{param*}',
        handler: {
            directory: {
                path: './lib',
                listing: false
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/js/{param*}',
        handler: {
            directory: {
                path: './js',
                listing: false
            }
        }
    });
    server.route({
        method: 'GET',
        path: '/css/{param*}',
        handler: {
            directory: {
                path: './css',
                listing: false
            }
        }
    });
    server.route({
        method: 'POST',
        path: '/uploadKML',
        config: {
            payload: {
                maxBytes: 209715200,
                output: 'stream',
                parse: true
            },
            handler: function(request, reply) {
                var data = request.payload;
                $.get('fsmanager').upload(data, function(err, content) {                    
                    $.get('storify').parseKML(content, function(err, ret) {
                        reply(ret);
                    });

                });
            }
        }
    });
};
