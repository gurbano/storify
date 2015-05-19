var SModule = require('./../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../Smartresize.js');
var helper = require('../../Helper.js')();
var EventType = require('../../EventType.js');

module.exports =  SSPlayer;


function SSPlayer(camera, controls, opts) {
    if (!(this instanceof SSPlayer)) return new SSPlayer(camera, controls, opts);
    this.opts = helper.extend({
            name: 'SSPlayer',
            id: 'SSPlayer'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
 
    return this;
}

inherits(SSPlayer, SModule);

SSPlayer.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('SSPlayer started');
};
SSPlayer.prototype.consume = function(frame) {
    var self = this; //things are gonna get nasty
    var ev = frame.getPositionEvent();
};