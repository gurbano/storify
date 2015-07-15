module.exports = EventManager


function EventManager(app, opts) {
	var self = this;
    opts = opts || {};
    if (!(this instanceof EventManager)) return new EventManager(app, opts);
    this.app = app;
    this.listeners = {};
    this.subscribe = function(target, event, fn) {
	    //$(document).bind(event, fn);
	    if (!self.listeners[event]){
	    	self.listeners[event] = [];
	    }
	    self.listeners[event].push({obj: target, func: fn});
	};
	this.unsubscribe = function(target, event, fn) {
	   //$(document).unbind(event, fn);
	   if (self.listeners[event]){
	   		for (var i = self.listeners[event].length - 1; i >= 0; i--) {
	   			if (self.listeners[event][i].obj===target){
	   				//todo: remove
	   			}
	   		};
	   }
	   	
	};
	this.publish = function(event, params) {
		console.info(event, params);
	    //$(document).trigger(event, params);
	    if (self.listeners[event]){
	    	var l = self.listeners[event];
	    	for (var i = l.length - 1; i >= 0; i--) {
	    		var tmp = l[i];
	    		tmp.func.apply(tmp.obj,[params]);
	    	};
	    }
	    
	};
    return this;
};
