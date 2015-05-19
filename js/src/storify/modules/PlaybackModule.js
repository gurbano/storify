var SModule = require('./SModule.js');
var inherits = require('inherits');
var smartresize = require('../Smartresize.js');
var helper = require('../Helper.js')();
var EventType = require('../EventType.js');

module.exports = PlayBackModule;


function PlayBackModule(clickModule, opts) {
    if (!(this instanceof PlayBackModule)) return new PlayBackModule(clickModule, opts);
    this.opts = helper.extend({
        name: 'PlayBackModule',
        id: 'PlayBackModule'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
    this.clickModule = clickModule;
    this.addProducer(this.clickModule);
    this.minSpeed = this.opts.minSpeed || 1;
    this.maxSpeed = this.opts.maxSpeed || 10;
    this.run = this.opts.autoStart || false;
    clickModule.start();
    return this;
}

inherits(PlayBackModule, SModule);

PlayBackModule.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('PlayBackModule  started');
    this.win = this.createModalWindow(
        'Playback', // Title
        { //options
            id: 'PlaybackWindows',
            content: '', //html to be displayed
            resizable: false,
            modal: true,
            width: 180,
            height: 150,
            position: {
                top: '50%',
                left: '40%'
            }
        },
        this.UIview); //parent div
    //this.win.width($(window).width());

    $(window).smartresize(function() {
        self.win.width($(window).width());
    });
    this.win.$content.append(this.createIcon('av:fast-rewind', function(btn, module) {
        self.clickModule.speed = Math.max(self.minSpeed, self.clickModule.speed - 1);
        //console.info(self.clickModule.speed);
    }));
    this.win.$content.append(this.createIcon('av:pause', function(btn, module) {
        self.togglePlay();
    }));
    this.win.$content.append(this.createIcon('av:fast-forward', function(btn, module) {
        self.clickModule.speed = Math.min(self.maxSpeed, self.clickModule.speed + 1);
        //console.info(self.clickModule.speed);
    }));
    $(document).keydown(function(e) {
        switch (e.which) {
            case 32: //space bar
                self.togglePlay();
                return;
            case 37: //left
                self.required('tmm').prevFrame();
                return;
            case 39: //right
                self.required('tmm').nextFrame();
                return;
            default:
                return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    return this;
}

PlayBackModule.prototype.togglePlay = function() {
    this.run = (!this.run);
}
PlayBackModule.prototype.consume = function(data) {
    var self = this; //things are gonna get nasty
    if (this.run)
        this.required('tmm').nextFrame();
}
