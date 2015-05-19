var SModule = require('././SModule.js');
var inherits = require('inherits');
var smartresize = require('.././Smartresize.js');
var helper = require('.././Helper.js')();
var EventType = require('.././EventType.js');

module.exports = CustomClickModule;


function CustomClickModule(speed, opts) {
    if (!(this instanceof CustomClickModule)) return new CustomClickModule(speed,opts);
    this.opts = helper.extend({
        name: 'CustomClickModule',
        id: 'CustomClickModule'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
    this.speed = speed; //fps
    this.framecount = 0;
    return this;
}

inherits(CustomClickModule, SModule);

CustomClickModule.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('CustomClickModule started');
    this.timeout = setTimeout(function(){
    	self.produce.call(self)
    }, 1000/self.speed);
};
CustomClickModule.prototype.produce = function() {
	var self = this; //things are gonna get nasty
    this.framecount++;
	self.consumers = self.consumers || [];
    for (var i = 0; i < this.consumers.length; i++) {
        this.consumers[i].consume({framecount:this.framecount});
    };
    this.timeout = setTimeout(function(){
    	self.produce.call(self)
    }, 1000/Math.max(1,self.speed)); //avoid division by zero or negative
};
