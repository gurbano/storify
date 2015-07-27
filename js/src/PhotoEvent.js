var inherits = require('inherits');
var Event = require('./Event.js');
var EventType = require('./EventType.js');

module.exports = PhotoEvent;
function PhotoEvent(opts){
	if (!(this instanceof PhotoEvent)) return new PhotoEvent(opts);
	Event.call(this,opts);
	this.type = EventType.PHOTO;
	return this;
};

inherits(PhotoEvent,Event);