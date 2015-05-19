var helper = require('../../Helper.js')();
require('./requestAnimationFrame.js');
var SModule = require('../SModule.js');
var inherits = require('inherits');
module.exports = EarthModuleRAFProducer;


function EarthModuleRAFProducer(parent, opts, _loop) {
    if (!(this instanceof EarthModuleRAFProducer)) return new EarthModuleRAFProducer(parent, opts, _loop);
    opts = helper.extend({
        name: 'EarthModuleRAFProducer',
        id: 'EarthModuleRAFProducer'
    }, opts);
    SModule.call(this, opts);
    this.loop = _loop || function(earthModule) {
        console.warn('No game loop???');
    };
    this.frameCounter = 0;
    this.parent = parent;
    return this;
}

inherits(EarthModuleRAFProducer, SModule);

/**
 * init
 *      this.renderer
 *      this.camera
 *      this.controls
 * @return {[type]} [description]
 */
EarthModuleRAFProducer.prototype.start = function() {
    var self = this; //things are gonna get nasty
    var parent = self.parent;
    var hw = parent.hw;
    console.info('starting engines...');
    self.render(self.parent);
    return self;
};

EarthModuleRAFProducer.prototype.render = function(parent) {
    var self = this; //things are gonna get nasty
    this.produce();
    this.loop(this.frameCounter ++, parent);// call the loop function injected by the parent
    requestAnimationFrame(function() {
        self.render(parent);
    });
};
EarthModuleRAFProducer.prototype.produce = function(framecount) {
    for (var i = 0; i < this.consumers.length; i++) {
        this.consumers[i].consume(framecount);
    };
};
