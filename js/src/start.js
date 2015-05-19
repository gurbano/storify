function sign(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
}

$(document).ready(function() {
    console.info('started');
    hello.init({
        facebook: '44687033716'
            //,windows: WINDOWS_CLIENT_ID,
            //google: GOOGLE_CLIENT_ID
    }, {
        redirect_uri: document.URL
    });
    console.info(document.URL);

    //$(".dial").knob();
    $('#main').width($(window).width());
    $('#main').height($(window).height());
    $(window).resize(function() {
        $('#main').width($(window).width());
        $('#main').height($(window).height());
    });
    var GLOBALS = {};
    GLOBALS.usm = new Usm({});
    GLOBALS.pb = new _pb($("#progress-bar"));
    if (init) {
        console.info('calling init');
        init(GLOBALS);
    } else {
        console.info('init not found!');
    }
});


var _pb = function(element) {
    var self = this;
    self.set = function(val) {
        self.toggle(true);
        element.width(val + '%');
        if (val >= 100) {
            setTimeout(function() {
                self.toggle(false);
            }, 2500);
        }
    };
    self.toggle = function(bool) {
        if (bool) {
            element.addClass('show');
        } else {
            element.removeClass('show');
        }
    };
    return self;
};
