var SModule = require('./SModule.js');
var inherits = require('inherits');
var smartresize = require('../Smartresize.js');
var helper = require('../Helper.js')();
var EventType = require('../EventType.js');

module.exports = EarthModule;

var minutes = 1000 * 60;
var hours = minutes * 60;
var days = hours * 24;
var years = days * 365;
var d = new Date();
var t = d.getTime();
var y = Math.round(t / years);

function EarthModule(opts) {
    if (!(this instanceof EarthModule)) return new EarthModule(opts);
    this.opts = helper.extend({
        name: 'EarthModule',
        id: 'EarthModule'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
    this.canvas = this.opts.parent; // where the canvas will be displayed
    this.mapOptions = helper.extend(this.mapOptions, this.opts.mapOptions || {});
    this.submodules = [];
    return this;
}

inherits(EarthModule, SModule);

var HW = require("./earthmodule/EarthModule.Hardware.js");
var SM = require("./earthmodule/EarthModule.SceneManager.js");
var EARTH = require("./earthmodule/EarthModule.Earth.js");
var EarthModuleRAFProducer = require("./earthmodule/EarthModule.RAFProducer.js");
var EarthModuleCameraPostProcessor = require('./earthmodule/EarthModule.CameraPostProcessor.js');


EarthModule.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('EarthModule started');
    self.hw = new HW(self, {}).start(); //Init hardware
    self.sm = new SM(self, {}).start(); //Init scene manager
    /*OBJECTS TO DISPLAY*/
    self.earth = new EARTH(self, {}).start(); //Planet earth
    /*START ALL SUBMODULES*/
    if (this.opts.submodules && this.opts.submodules.length>0){
        var submodules = this.opts.submodules;
        for (var i = 0; i < submodules.length;   i++) {
            var submodule = submodules[i];   
        };
    }

    //var pp = new EarthModuleCameraPostProcessor(self, self.sm.scene, self.hw.camera, self.hw.renderer, {});

    //Request animation frame producer
    self.ticker = new EarthModuleRAFProducer(
        self, {}, //parent, options 
        function(framecount, earthmodule) { //main loop. 
            earthmodule.hw.controls.update();
            earthmodule.hw.renderer.render(earthmodule.sm.scene, earthmodule.hw.camera);
            self.produce(framecount);
        }).start();

    /**/
    if (this.opts.callbacks && this.opts.callbacks.postInit) {
        this.opts.callbacks.postInit();
    }
    return this;
};

EarthModule.prototype.produce = function(framecount) {
    for (var i = 0; i < this.consumers.length; i++) {
        this.consumers[i].consume(framecount,'FRAMECOUNT');
    };
};
EarthModule.prototype.consume = function(frame) { //

};
