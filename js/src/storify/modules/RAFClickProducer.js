var SModule = require('././SModule.js');
var inherits = require('inherits');
require('./earthmodule/requestAnimationFrame.js');
var helper = require('.././Helper.js')();

module.exports = RAFClickProducer;


function RAFClickProducer(opts) {
    if (!(this instanceof RAFClickProducer)) return new RAFClickProducer(opts);
    this.opts = helper.extend({
        name: 'RAFClickProducer',
        id: 'RAFClickProducer'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
    this.framecount = 0;
    return this;
}

inherits(RAFClickProducer, SModule);

RAFClickProducer.prototype.start = function() {
    var self = this; //things are gonna get nasty
    self.render();
    return self;
};

RAFClickProducer.prototype.render = function() {
    var self = this; //things are gonna get nasty
    this.produce();
    requestAnimationFrame(function() {
        self.render();
    });
};
RAFClickProducer.prototype.produce = function() {
    this.framecount++;
    for (var i = 0; i < this.consumers.length; i++) {
        this.consumers[i].consume({framecount:this.framecount});
    };
};