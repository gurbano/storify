var SModule = require('./../../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../../Smartresize.js');
var helper = require('../../../Helper.js')();
var EventType = require('../../../EventType.js');

module.exports = CowabungaMouseHandler;


function CowabungaMouseHandler(canvas,opts) {
    if (!(this instanceof CowabungaMouseHandler)) return new CowabungaMouseHandler(canvas, opts);
    this.opts = helper.extend({
        name: 'CowabungaMouseHandler',
        id: 'CowabungaMouseHandler'
    }, opts);
    this.canvas = canvas;
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
    this.input = {
        s_down : false,
        d_down : false,
        w_down : false,
        w_roll : 0
    };
    return this;
}

inherits(CowabungaMouseHandler, SModule);

CowabungaMouseHandler.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('CowabungaMouseHandler started');
    this.canvas.click(function(event){
        self.produce(event);
    });
    this.canvas.bind('mousewheel', function(event){
        event.up = (event.originalEvent.wheelDelta /120 > 0);
        self.produce(event);      
    });


};
CowabungaMouseHandler.prototype.produce = function(event) {
    var self = this; //things are gonna get nasty
     if (!this.enabled || !this.started) {
        return;
    }
    self.consumers = self.consumers || [];
    for (var i = 0; i < this.consumers.length; i++) {
        this.consumers[i].consume({
            event: event
        });
    };
};
