(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\workspaces\\github\\storify\\js\\src\\Event.js":[function(require,module,exports){
var EventType = require('./EventType.js');
module.exports = Event;

function Event(opts) {
    if (!(this instanceof Event)) return new Event(opts);
    this.type = EventType.GENERIC;
    this.start_frame = opts.start_frame || 0;
    this.end_frame = opts.end_frame || 0;
    this.end_time = opts.end_time || 0;
    this.start_time = opts.start_time || 0;
    this.data = opts.data || {};
    this.subtype = opts.subtype || {};
    return this;
}

},{"./EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\EventType.js"}],"C:\\workspaces\\github\\storify\\js\\src\\EventBus.js":[function(require,module,exports){
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
},{}],"C:\\workspaces\\github\\storify\\js\\src\\EventType.js":[function(require,module,exports){
module.exports ={
	GENERIC : {id : 000, type : 'GENERIC'},
	POSITION : {id : 100, type : 'POSITION'},
	PHOTO : {id : 200, type : 'PHOTO'},
	VIDEO  :{id : 300, type : 'VIDEO'},
	MUSIC  :{id : 400, type : 'MUSIC'},
};
},{}],"C:\\workspaces\\github\\storify\\js\\src\\Frame.js":[function(require,module,exports){
var EventType = require('./EventType.js');
var GpsEvent = require('./GpsEvent.js');
var Event = require('./Event.js');

module.exports = Frame;

function Frame(opts){
	if (!(this instanceof Frame)) return new Frame(opts);
	this.index = opts.index || 0; // index of the frame, relative to the timeline
	this.time =  opts.time || 0; // Date
	this.events = opts.events || []; //cache degli eventi
	return this;
}

Frame.prototype.getPositionEvent = function(first_argument) {
	for (var i = 0; i < this.events.length; i++) {
		if (this.events[i].type === EventType.POSITION){
			return this.events[i];
		}
	}
};

Frame.prototype.getEventsByType = function(type) {
	var ret =[];
	for (var i = 0; i < this.events.length; i++) {
		if (this.events[i].type === type){
			ret.push(this.events[i]);
		}
	}
	return ret;
};
},{"./Event.js":"C:\\workspaces\\github\\storify\\js\\src\\Event.js","./EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\EventType.js","./GpsEvent.js":"C:\\workspaces\\github\\storify\\js\\src\\GpsEvent.js"}],"C:\\workspaces\\github\\storify\\js\\src\\GpsEvent.js":[function(require,module,exports){
var inherits = require('inherits');
var Event = require('./Event.js');
var EventType = require('./EventType.js');

module.exports = GpsEvent;
function GpsEvent(opts){
	if (!(this instanceof GpsEvent)) return new GpsEvent(opts);
	Event.call(this,opts);
	this.position = opts.position || new google.maps.LatLng(0, 0);
	this.speed = opts.speed || 0;
	this.distance = opts.distance || 0; //m
	this.real_time = opts.real_time || 0; //ms date
	this.isReal = opts.isReal || false;
	this.interpolated = opts.interpolated || false;
	this.next = opts.next || {};
	this.prev = opts.prev || {};
	this.skipped = opts.skipped || [];
	this.type = EventType.POSITION;
	return this;
};

inherits(GpsEvent,Event);
},{"./Event.js":"C:\\workspaces\\github\\storify\\js\\src\\Event.js","./EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\EventType.js","inherits":"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js"}],"C:\\workspaces\\github\\storify\\js\\src\\SGUI_EDIT.js":[function(require,module,exports){
//SGUI
var Timeline = require('./Timeline.js');
var config = {};
config.kmlimport = require('./gui/kmlImporter.js');
config.kmltimeline = require('./gui/kmlTimeline.opt.js');
config.phototimeline = require('./gui/photoTimeline.js');
config.datetimeline = require('./gui/dateTimeline.js');


module.exports = SGUI;

function SGUI(app, opts) {
    var self = this;
    opts = opts || {};
    if (!(this instanceof SGUI)) return new SGUI(app, opts);
    this.app = app;
    this.target = $('#target');
    this.guis = {};
    /*KML IMPORTER*/
    var importerGUI = this.addGUI('kmlImporter',{classes: 'EDIT-GUI', config: config.kmlimport });
    var myDropzone = new Dropzone("#drop_target", {
       		url: "/uploadKML"
	});
	myDropzone.on("success", function(file, res) {
		self.app.bus.publish('EVENT.GUI.KMLUPLOADED',res);
	});
	myDropzone.on("complete", function(file) {

	});
	myDropzone.on("uploadprogress", function(file, progress) {

	});


	/*KML TIMELINE*/
    /*photo timeline*/
    this.photoTimeline = new Timeline(config.phototimeline, function(that){
		self.addGUI('photo-timeline-wrapper',{classes: 'VIEW-GUI', config: that.opts });
		that.div = $('#photo-timeline-wrapper > div');
	});
    /*Calendar timeline*/
    this.dateTimeline = new Timeline(config.datetimeline, function(that){
		self.addGUI('date-timeline-wrapper',{classes: 'VIEW-GUI', config: that.opts });
		that.div = $('#date-timeline-wrapper > div');
	});
    /*KML TIMELINE*/
	this.kmlTimeline = new Timeline(config.kmltimeline, function(that){
		self.addGUI('kml-timeline-wrapper',{classes: 'VIEW-GUI', config: that.opts });
		that.div = $('#kml-timeline-wrapper > div');
	});
    
  	/*GMAP*/
  	var mapOptions = {
        center: new google.maps.LatLng(41.54, 12.30),
        disableDefaultUI: true,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById('map-canvas'),  mapOptions);
    this.marker = new google.maps.Marker({
        position:  this.map.getCenter(),
        map: this.map
    });


    return self;
}

SGUI.prototype.printInfo = function() {
	console.info(this.app);
};


SGUI.prototype.close = function(_id) {
	if (this.guis[_id].modal){
		this.guis[_id].dialog( "close" );
	}else{
		this.guis[_id].hide();
	}
};

SGUI.prototype.addGUI = function(_id, opts) {
	var width = opts.config.width || opts.width || "200";
	var height = opts.config.height || opts.height || "200"
	var $div = $("<div>", {id: _id, class: "GUI"});
	this.target.append($div);
	this.guis[_id] = $div;
	$div.addClass(opts.classes || "gui");
	if (opts.config.modal){
		$div.modal = true;
		$div.dialog({width:width, height:height});	
	}
	$div.append($(opts.config.div));
	opts.config.init();

	return $div;
};
},{"./Timeline.js":"C:\\workspaces\\github\\storify\\js\\src\\Timeline.js","./gui/dateTimeline.js":"C:\\workspaces\\github\\storify\\js\\src\\gui\\dateTimeline.js","./gui/kmlImporter.js":"C:\\workspaces\\github\\storify\\js\\src\\gui\\kmlImporter.js","./gui/kmlTimeline.opt.js":"C:\\workspaces\\github\\storify\\js\\src\\gui\\kmlTimeline.opt.js","./gui/photoTimeline.js":"C:\\workspaces\\github\\storify\\js\\src\\gui\\photoTimeline.js"}],"C:\\workspaces\\github\\storify\\js\\src\\SStory.js":[function(require,module,exports){
//SStory

var helper = require('./helper.js')();

module.exports = SStory;

function SStory(app, opts) {
    var self = this;
    this.opts = helper.extend({}, opts);
    if (!(this instanceof SStory)) return new SStory(app, opts);
    this.app = app;
    this.startTime = opts.startTime || new Date().getTime();
    this.endTime = opts.endTime || new Date().getTime();
	this.title = this.opts.title || 'untitled story';
	this.description = this.opts.description || 'new story to be filled';
	this.createdOn = this.opts.createdOn || helper.dateToString(new Date());
	this.events = [];
    this.importKmlEvents = function(data) {  
        var kmlEvents = [];
        if (new Date(data[0].when).getTime()<self.startTime) {        
            self.startTime = new Date(data[0].when).getTime();
            console.info('Start moved to ' + new Date(self.startTime));
            self.app.bus.publish('EVENT.STORY.REFRESH.DATE');
        }
        if (new Date(data[data.length-1].when).getTime()>self.endTime) {
            self.endTime = new Date(data[data.length-1].when).getTime();
            console.info('End moved to ' + new Date(self.endTime));
            self.app.bus.publish('EVENT.STORY.REFRESH.DATE');
        }
        for (var i = 0 ; i < data.length; i++) {
            var startTime = new Date(data[i].when).getTime();
            kmlEvents.push({type: 'kml', when: startTime, where: data[i].where , delta: startTime - self.startTime });
            self.events.push({type: 'kml', when: startTime, where: data[i].where , delta: startTime - self.startTime });
        };
        self.app.bus.publish('EVENT.STORY.REFRESH.KML',{events: kmlEvents});
    };
    return self;
}


SStory.prototype.getEvents = function(type) {
    function hasType(_event) {
        return _event.type === type;
    }
    return this.events.filter(hasType);
};

SStory.prototype.parseKML = function(content, callback) {
	xml2js.parseString(content, function(err, result) {
    	if (err) {
            callback(err, null);
        }
        var when = result.kml.Document[0].Placemark[0]['gx:Track'][0].when;
        var where = result.kml.Document[0].Placemark[0]['gx:Track'][0]['gx:coord'];
        /**
        * start : DATE
        * end : DATE
        * points : []
        */
        var obj = {};
        obj.ret = [];
        obj.start = new Date(when[0]);
        obj.end = new Date(when[when.length - 1]);		
		for (var ii = 0; ii < when.length; ii++) {
        	var event = {
               'when': new Date(when[ii]),
               'where': {
                    lng: where[ii].split(' ')[0],
                    lat: where[ii].split(' ')[1]
                }
            };
            obj.ret.push(event);
        }
        callback(null, obj);
	});
};

},{"./helper.js":"C:\\workspaces\\github\\storify\\js\\src\\helper.js"}],"C:\\workspaces\\github\\storify\\js\\src\\Timeline.js":[function(require,module,exports){
var Frame = require('./Frame.js');
var helper = require('./storify/Helper.js')();

module.exports = Timeline;

function Timeline(opts, cb) {
    if (!(this instanceof Timeline)) return new Timeline(opts,cb);
    this.opts = opts;
    this.scale = opts.scale || 1; // delta minutes between frames
    this.frames = opts.frames || [];
    this.start = opts.start || 0; // ms
    this.end = opts.end || 0; // ms
    this.events = opts.events || [];
    if (cb){
        cb(this);
    }
    return this;
}

Timeline.prototype.getMsStep = function() {
    return this.scale * 60 * 1000;
};
Timeline.prototype.getPercAtFrame = function(_f, _precision) {
    var precision = _precision || 2;
    var frameIndex = Math.max(0, Math.min(_f, this.steps - 1));
    var offset = ((frameIndex / (this.steps - 1)) * (100)).toFixed(precision);
    return offset;
};
Timeline.prototype.getFrameAtPerc = function(_p) {
    var percentage = Math.max(0, Math.min(_p, 100));
    var offset = ((percentage / 100) * (this.steps - 1)).toFixed(0);
    return this.frames[offset];
};

Timeline.prototype.extend = function(newstart, newend) {
    //console.info(this.frames, helper.shallowCopy(this.frames));
    var frameCopy = helper.shallowCopy(this.frames);
    this.start = newstart;
    this.end = newend;
    this.frames = [];
    for (var i = this.events.length - 1; i >= 0; i--) {
        if (this.events[i].subtype && this.events[i].subtype === '__auto') {
            this.events = this.events.splice(i, 1); //index, howmany
        }
    };
    this.initialize();
};

Timeline.prototype.addEvent = function(event) {
    this.events.push(event);
    for (var i = event.start_frame; i <= event.end_frame; i++) {
        this.frames[i].events.push(event); //cache
    };
};

Timeline.prototype.initialize = function() {
    var startMs = this.start.getTime();
    var endMs = this.end.getTime();
    var diffMs = endMs - startMs;
    var diffm = diffMs / 1000 / 60;
    var diffh = diffm / 60;
    var diffd = diffh / 24;
    var self = this; //things are gonna get messy

    this.steps = (diffm / this.scale).toFixed(0);
    for (var i = 0; i < this.steps; i++) {
        var frame = new Frame({
            index: i,
            time: startMs + (i * 1000 * 60 * this.scale),
            events: [] //cache is initialized 
        });
        this.frames.push(frame);
    }
    //console.info('Timeline initialized', this.start,this.end, ' steps: ',this.steps);
    //console.info(this);
};
},{"./Frame.js":"C:\\workspaces\\github\\storify\\js\\src\\Frame.js","./storify/Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js"}],"C:\\workspaces\\github\\storify\\js\\src\\gui\\dateTimeline.js":[function(require,module,exports){
module.exports  = {
	width: $(document).width(),
	height : 200,
	div: '<div class="timeline"><span>DATE</span></div>',
	init: function() {

	},
	addEvents: function(){}
};
},{}],"C:\\workspaces\\github\\storify\\js\\src\\gui\\kmlImporter.js":[function(require,module,exports){
module.exports = {
	modal: true,
	width: 800,
	height : 200,
	div: '<input type="text" id="__start"></input> <input type="text" id="__end"></input> <input type="button" id="__button" value="Import"></input><div id="drop_target">&nbsp;</div>',
	init: function() {
		$( "#__start" ).datepicker({ 
			showOtherMonths: true,
      		selectOtherMonths: true});
		$( "#__end" ).datepicker({ 
			showOtherMonths: true,
      		selectOtherMonths: true});
		$( "#__button" ).click(function(){
			var url = "https://maps.google.com/locationhistory/b/0/kml?startTime="+ new Date($( "#__start" ).val()).getTime()+"&endTime="+ new Date($( "#__end" ).val()).getTime();
			window.open(url,'_blank');
		});		
	}
};
},{}],"C:\\workspaces\\github\\storify\\js\\src\\gui\\kmlTimeline.opt.js":[function(require,module,exports){
module.exports  = {
	width: $(document).width(),
	height : 200,
	div: '<div class="timeline"><span>KML</span></div>',
	init: function(wrapper) {

	},
	addEvents: function(){}
};
},{}],"C:\\workspaces\\github\\storify\\js\\src\\gui\\photoTimeline.js":[function(require,module,exports){
module.exports  = {
	width: $(document).width(),
	height : 200,
	div: '<div class="timeline"><span>PHOTO</span></div>',
	init: function(wrapper) {

	},
	addEvents: function(){}
};
},{}],"C:\\workspaces\\github\\storify\\js\\src\\helper.js":[function(require,module,exports){
module.exports = Helper;

function Helper() {
    if (!(this instanceof Helper)) return new Helper();
    this.DATE_FORMAT = 'dd MM hh:ii';
    this.FB_DATE = 'dd/mm/yyyy hh:ii'
    return this;
}
Helper.prototype.get = function() {
    return this;
};
Helper.prototype.dateToString = function(date) {
    return $.formatDateTime(this.DATE_FORMAT, date);
};
Helper.prototype.toFbDate = function(date) {
    return date.getTime();
};
Helper.prototype.msToString = function(date) {
    return $.formatDateTime(this.DATE_FORMAT, new Date(date));
};
Helper.prototype.deltaToString = function(delta) {
    var deltaS = ((delta / 1000) % 60).toFixed(0);
    var deltaM = ((delta / 1000 / 60) % 60).toFixed(0);
    var deltaH = ((delta / 1000 / 60 / 60) % 24).toFixed(0);
    return deltaH + 'h ' + deltaM + 'm ' + deltaS + 's';
};
Helper.prototype.stringToDate = function(s) {
    return new Date(s);
};
Helper.prototype.deepCopy = function(oldObject) {
    return $.extend(true, {}, oldObject);
};
Helper.prototype.shallowCopy = function(oldObject) {
    return $.extend({}, oldObject);
};
Helper.prototype.random = function(min, max) {
    return Math.random() * (max - min) + min;
};
Helper.prototype.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
Helper.prototype.extend = function(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }

    return a;
};

Helper.prototype.maximize = function($div) {
    $div.width($(window).width());
    $div.height($(window).height());
};

Helper.prototype.debounce = function(func, threshold, execAsap) {
    var timeout;

    return function debounced() {
        var obj = this,
            args = arguments;

        function delayed() {
            if (!execAsap)
                func.apply(obj, args);
            timeout = null;
        };

        if (timeout)
            clearTimeout(timeout);
        else if (execAsap)
            func.apply(obj, args);

        timeout = setTimeout(delayed, threshold || 100);
    };
};

Helper.prototype.distance = function(from, to) {
    try {
        return google.maps.geometry.spherical.computeDistanceBetween(from, to);
    } catch (e) {
        return 0;
    }
};
Helper.prototype.speedMS = function(from, to, ms) {
    var m = google.maps.geometry.spherical.computeDistanceBetween(from, to);
    var speed = m / (1000 * ms);
    return speed;
};
Helper.prototype.speedKmH = function(from, to, ms) {
    var speedKm = (this.speedMS(from, to, ms) //m/s
        * 60 // m/min
        * 60 // m/h
    ) / 1000; //km/h
    return speedKm;
};





Helper.prototype.easeInOutQuad = function(t, b, c, d) {
    if (t < d / 2) return 2 * c * t * t / (d * d) + b;
    var ts = t - d / 2;
    return -2 * c * ts * ts / (d * d) + 2 * c * ts / d + c / 2 + b;
}




/**/

Helper.prototype.interpolate = function(val, min, max, new_min, new_max) {
    //         (b - a)(x - min)
    // f(x) = -- -- -- -- -- -- -- + a
    //             max - min
    //             

    var fx = new_min + (((new_max-new_min)*(val - min))/(max - min))
    return fx;
};
Helper.prototype.dayOfTheYear = function(date) {
    var j1 = new Date(date);
    j1.setMonth(0, 0);
    return Math.round((date - j1) / 8.64e7);
};

Helper.prototype.getUID = function() {
    return '#' + new Date().getTime();
}




},{}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js":[function(require,module,exports){
module.exports = Helper;

function Helper() {
    if (!(this instanceof Helper)) return new Helper();
    this.DATE_FORMAT = 'dd MM hh:ii';
    this.FB_DATE = 'dd/mm/yyyy hh:ii'
    return this;
}
Helper.prototype.get = function() {
    return this;
};
Helper.prototype.dateToString = function(date) {
    return $.formatDateTime(this.DATE_FORMAT, date);
};
Helper.prototype.toFbDate = function(date) {
    return date.getTime();
};
Helper.prototype.msToString = function(date) {
    return $.formatDateTime(this.DATE_FORMAT, new Date(date));
};
Helper.prototype.deltaToString = function(delta) {
    var deltaS = ((delta / 1000) % 60).toFixed(0);
    var deltaM = ((delta / 1000 / 60) % 60).toFixed(0);
    var deltaH = ((delta / 1000 / 60 / 60) % 24).toFixed(0);
    return deltaH + 'h ' + deltaM + 'm ' + deltaS + 's';
};
Helper.prototype.stringToDate = function(s) {
    return new Date(s);
};
Helper.prototype.deepCopy = function(oldObject) {
    return $.extend(true, {}, oldObject);
};
Helper.prototype.shallowCopy = function(oldObject) {
    return $.extend({}, oldObject);
};
Helper.prototype.random = function(min, max) {
    return Math.random() * (max - min) + min;
};
Helper.prototype.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
Helper.prototype.extend = function(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }

    return a;
};

Helper.prototype.maximize = function($div) {
    $div.width($(window).width());
    $div.height($(window).height());
};

Helper.prototype.debounce = function(func, threshold, execAsap) {
    var timeout;

    return function debounced() {
        var obj = this,
            args = arguments;

        function delayed() {
            if (!execAsap)
                func.apply(obj, args);
            timeout = null;
        };

        if (timeout)
            clearTimeout(timeout);
        else if (execAsap)
            func.apply(obj, args);

        timeout = setTimeout(delayed, threshold || 100);
    };
};

Helper.prototype.distance = function(from, to) {
    try {
        return google.maps.geometry.spherical.computeDistanceBetween(from, to);
    } catch (e) {
        return 0;
    }
};
Helper.prototype.speedMS = function(from, to, ms) {
    var m = google.maps.geometry.spherical.computeDistanceBetween(from, to);
    var speed = m / (1000 * ms);
    return speed;
};
Helper.prototype.speedKmH = function(from, to, ms) {
    var speedKm = (this.speedMS(from, to, ms) //m/s
        * 60 // m/min
        * 60 // m/h
    ) / 1000; //km/h
    return speedKm;
};





Helper.prototype.easeInOutQuad = function(t, b, c, d) {
    if (t < d / 2) return 2 * c * t * t / (d * d) + b;
    var ts = t - d / 2;
    return -2 * c * ts * ts / (d * d) + 2 * c * ts / d + c / 2 + b;
}


Helper.prototype.setUIModes = function(view, edit) {
    if (edit && !$('#UI-EDIT').hasClass('active')) {
        $('#UI-EDIT').addClass('active');
    };
    if (view && !$('#UI-VIEW').hasClass('active')) {
        $('#UI-VIEW').addClass('active');
    };

};



/**/

Helper.prototype.interpolate = function(val, min, max, new_min, new_max) {
    //         (b - a)(x - min)
    // f(x) = -- -- -- -- -- -- -- + a
    //             max - min
    //             

    var fx = new_min + (((new_max-new_min)*(val - min))/(max - min))
    return fx;
};
Helper.prototype.dayOfTheYear = function(date) {
    var j1 = new Date(date);
    j1.setMonth(0, 0);
    return Math.round((date - j1) / 8.64e7);
};

Helper.prototype.getUID = function() {
    return '#' + new Date().getTime();
}




},{}],"C:\\workspaces\\github\\storify\\js\\src\\test.js":[function(require,module,exports){
var test = 10;
module.exports = test;
},{}],"C:\\workspaces\\github\\storify\\js\\storify_edit.js":[function(require,module,exports){
var test = require('./src/test');
var SGUI = require('./src/SGUI_EDIT');
var SStory = require('./src/SStory');
var EventBus = require('./src/EventBus');


function S(opts) {
    var self = this;
    opts = opts || {};
    if (!(this instanceof S)) return new S(opts);
   	this.bus = new EventBus(this,{});
    //this.datgui = new dat.GUI();
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
    this.subscribe('EVENT.GUI.KMLUPLOADED',function(event,params){
        self.story.importKmlEvents(params.ret);
        self.sgui.close('kmlImporter');
    });
    this.subscribe('EVENT.STORY.REFRESH.PHOTO',function(event,params){
                 
    });
    this.subscribe('EVENT.STORY.REFRESH.KML',function(event,params){
        /*
        console.info(event,params);
        var events = params.events;
        if (params.clear)
            self.sgui.kmlTimeline.clearEvents();
        self.sgui.kmlTimeline.addEvents(events);
        */

        var leftoff = 100;
        var $tline = self.sgui.kmlTimeline.div;  //$('#kml-timeline-wrapper > div');
        var delta = self.story.endTime - self.story.startTime;
        var width = $tline.width() - leftoff;
        var events = self.story.getEvents('kml');
        for (var i = 0; i <= events.length - 1; i++) {
            var offset = events[i].delta/delta;
            var offsetPx = Math.floor(offset * width) + leftoff;
            //console.info(i,offset, offsetPx);
            var $div = $("<div>", {id: events[i].delta,  class: "kml-timeline-event"});
            $div.attr('index',i);
            $div.css('left',  offsetPx +'px');
            $div.ev = events[i];
            $div.hover( function(){
                var events = self.story.events[$(this).attr('index')];
                self.bus.publish("EVENT.GUI.TIMELINE.HOVER",events);
            }, function(){

            } );
            $div.click( function(){
                var events = self.story.events[$(this).attr('index')];
                self.bus.publish("EVENT.GUI.TIMELINE.CLICK",events);
            });
            $tline.append($div);
        };
                        
    });
    this.subscribe('EVENT.STORY.REFRESH.DATE',function(event,params){
        
    });    

}

S.prototype.start = function() {
    console.info('started',STORIFY);
    
};



var STORIFY = {};
STORIFY.app = new S();
$(document).ready(function() {
    STORIFY.app.start();
});




},{"./src/EventBus":"C:\\workspaces\\github\\storify\\js\\src\\EventBus.js","./src/SGUI_EDIT":"C:\\workspaces\\github\\storify\\js\\src\\SGUI_EDIT.js","./src/SStory":"C:\\workspaces\\github\\storify\\js\\src\\SStory.js","./src/test":"C:\\workspaces\\github\\storify\\js\\src\\test.js"}],"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js":[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}]},{},["C:\\workspaces\\github\\storify\\js\\storify_edit.js"]);
