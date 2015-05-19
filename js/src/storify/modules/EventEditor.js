var SModule = require('././SModule.js');
var inherits = require('inherits');
var smartresize = require('.././Smartresize.js');
var helper = require('.././Helper.js')();
var EventType = require('.././EventType.js');

module.exports =  EventEditor;


function EventEditor(opts) {
    if (!(this instanceof EventEditor)) return new EventEditor(opts);
    this.opts = helper.extend({
            name: 'EventEditor',
            id: 'EventEditor'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
 
    return this;
}

inherits(EventEditor, SModule);

EventEditor.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('EventEditor started');
};
EventEditor.prototype.consume = function(frame) {
    var self = this; //things are gonna get nasty
    var ev = frame.getPositionEvent();
};
