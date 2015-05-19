/**
    - Usm start(required(failure,success))
    - void forceLogin({method: ''})

    - User getUser (user or null)
    - boolean isLogged()


    ERRORS:
    .errors.USER_REQUIRED
*/

var Usm = function(_options) {
    var self = this;
    self.user = undefined;
    //Public part
    self.start = function() {
        self.user = getUserFromCookie();
        return self;
    };
    self.getPosition = function(__callback, delay) {
        var options = {
            enableHighAccuracy: true,
            timeout: delay || 2000,
            maximumAge: 0
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    __callback(null, position);
                },
                function(position) {
                    __callback({err: 'KO'}, null);
                },
                options
            );
        } else {
            __callback(null, null);
        }
    }
    self.login = function(__options, success, failure) {
        if (!__options.method) {
            failure('method required as parameter.');
        }
        var network = __options.method;
        hello(network).login({scope: "friends,photos" }).then(function() {
            hello(network).api('me').then(function(p) {
                self.user = p;
                success(self.user);
            });

        }, function(e) {
            failure("Signin error: " + e.error.message);
        });
    };
    self.bindUI = function(ui) { //TODO
        if (self.ui) self.unbindUI();
        self.ui = ui;
        hello.on('auth', ui.on('auth'));
        hello.on('auth.login', ui.on('auth.login'));
        hello.on('auth.logout', ui.on('auth.logout'));
        hello.on('auth.update', ui.on('auth.update'));
    };
    self.requireFacebook = function(__callback) {
        GLOBALS.usm.login({ //redirect the user to this same page
            method: 'facebook'
        }, function success(user) {
            self.user = user;
            __callback(null, user);
        }, function failure(err) {
            __callback(err, null);
        });
    };
    /*private part*/
    var getUserFromCookie = function() { //TODO
        return self.user;
    };
    /*ERRORS*/
    self.errors = {
        USER_REQUIRED: 1
    };
    return self;
};
