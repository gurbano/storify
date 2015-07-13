module.exports = EventManager


function EventManager(app, opts) {
    var self = this;
    opts = opts || {};
    if (!(this instanceof EventManager)) return new EventManager(app, opts);
    this.app = app;
    return self;
};

EventManager.prototype.subscribe = function(event, fn) {
    $(document).on(event, fn);
};
EventManager.prototype.unsubscribe = function(event, fn) {
    $(document).unbind(event, fn);
};
EventManager.prototype.publish = function(event, params) {
	console.info(event, params);
    $(document).trigger(event, params);
    
};