var test = require('./src/test');
var SGUI = require('./src/SGUI');
var SStory = require('./src/SStory');
var EventBus = require('./src/EventBus');




function S(opts) {
    var self = this;
    opts = opts || {};
    if (!(this instanceof S)) return new S(opts);
   	this.bus = new EventBus(this,{});
    /*INIT SUBMODULES*/
    this.datgui = new dat.GUI();
    this.sgui = new SGUI(this,{});
    this.story = new SStory(this, {
    	startTime : new Date().getTime(),
    	endTime : new Date("1/1/1900").getTime()}
	);

    
    this.subscribe = function(event, fn) {
        self.bus.subscribe(event, fn);
    };
    this.unsubscribe = function(event, fn) {
        self.bus.unsubscribe(event, fn);
    };
    this.publish = function(event, params) {
        self.bus.publish(event, params);
    };
    self.subscribe('klmuploaded',function(event,params){
    	self.story.importKmlEvents(params.ret);
    	self.sgui.close('kmlImporter');
    });

}

S.prototype.start = function() {
    console.info(STORIFY);
    this.subscribe('test', function(event, params){
    	console.info('triggered',event, params);
    });
    
};



var STORIFY = {};
STORIFY.app = new S();
$(document).ready(function() {
    STORIFY.app.start();
});
