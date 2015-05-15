(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\workspaces\\github\\storify\\js\\src\\EventBus.js":[function(require,module,exports){
module.exports = EventManager


function EventManager(app, opts) {
    var self = this;
    opts = opts || {};
    if (!(this instanceof EventManager)) return new EventManager(app, opts);
    this.app = app;
    return self;
};

EventManager.prototype.subscribe = function(event, fn) {
    $(document).bind(event, fn);
};
EventManager.prototype.unsubscribe = function(event, fn) {
    $(document).unbind(event, fn);
};
EventManager.prototype.publish = function(event, params) {

    $(document).trigger(event, params);
};
},{}],"C:\\workspaces\\github\\storify\\js\\src\\SGUI.js":[function(require,module,exports){
//SGUI

var config = {};
config.kmlimport = require('./gui/kmlimporter.js');
config.timeline = require('./gui/timeline.js');


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
		self.app.bus.publish('klmuploaded',res);
	});
	myDropzone.on("complete", function(file) {

	});
	myDropzone.on("uploadprogress", function(file, progress) {

	});
	/*TIMELINE*/
	var timeline = this.addGUI('timeline-wrapper',{classes: 'VIEW-GUI', config: config.timeline });
  	this.app.bus.subscribe('STORY.REFRESH',function(event,params){
        var $tline = $('#timeline');
        var delta = self.app.story.endTime - self.app.story.startTime;
        var width = $tline.width();
        var events = self.app.story.events;
        for (var i = 0; i <= events.length - 1; i++) {
        	var offset = events[i].delta/delta;
        	var offsetPx = Math.floor(offset * width);
        	//console.info(i,offset, offsetPx);
        	var $div = $("<div>", {id: events[i].delta,  class: "timeline-event"});
        	$div.attr('index',i);
        	$div.css('left',  offsetPx +'px');
        	$div.ev = events[i];
        	$div.hover( function(){
        		var event = self.app.story.events[$(this).attr('index')];
        		//console.info(event);
        		self.map.setCenter(new google.maps.LatLng(event.where.lat, event.where.lng))
        		self.marker.setPosition(self.map.getCenter());
        	}, function(){

        	} ) 
        	$tline.append($div);
        };
                        
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
},{"./gui/kmlimporter.js":"C:\\workspaces\\github\\storify\\js\\src\\gui\\kmlimporter.js","./gui/timeline.js":"C:\\workspaces\\github\\storify\\js\\src\\gui\\timeline.js"}],"C:\\workspaces\\github\\storify\\js\\src\\SStory.js":[function(require,module,exports){
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
    return self;
}

SStory.prototype.importKmlEvents = function(data) {   //
    if (new Date(data[0].when).getTime()<this.startTime) {        
        this.startTime = new Date(data[0].when).getTime();
        console.info('Start moved to ' + new Date(this.startTime));
    }
    if (new Date(data[data.length-1].when).getTime()>this.endTime) {
        this.endTime = new Date(data[data.length-1].when).getTime();
        console.info('End moved to ' + new Date(this.endTime));
    }
    for (var i = 0 ; i < data.length; i++) {
        var startTime = new Date(data[i].when).getTime();
        this.events.push({type: 'kml', when: startTime, where: data[i].where , delta: startTime - this.startTime });
    };
    this.app.bus.publish('STORY.REFRESH');
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

},{"./helper.js":"C:\\workspaces\\github\\storify\\js\\src\\helper.js"}],"C:\\workspaces\\github\\storify\\js\\src\\gui\\kmlimporter.js":[function(require,module,exports){
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
},{}],"C:\\workspaces\\github\\storify\\js\\src\\gui\\timeline.js":[function(require,module,exports){
module.exports  = {
	width: $(document).width(),
	height : 200,
	div: '<div id="timeline"></div>',
	init: function() {
	}
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




},{}],"C:\\workspaces\\github\\storify\\js\\src\\test.js":[function(require,module,exports){
var test = 10;
module.exports = test;
},{}],"C:\\workspaces\\github\\storify\\js\\storify.js":[function(require,module,exports){
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

},{"./src/EventBus":"C:\\workspaces\\github\\storify\\js\\src\\EventBus.js","./src/SGUI":"C:\\workspaces\\github\\storify\\js\\src\\SGUI.js","./src/SStory":"C:\\workspaces\\github\\storify\\js\\src\\SStory.js","./src/test":"C:\\workspaces\\github\\storify\\js\\src\\test.js"}]},{},["C:\\workspaces\\github\\storify\\js\\storify.js"]);
