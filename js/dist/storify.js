(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\workspaces\\github\\storify\\js\\src\\storify\\Event.js":[function(require,module,exports){
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

},{"./EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\EventType.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\EventType.js":[function(require,module,exports){
module.exports ={
	GENERIC : {id : 000, type : 'GENERIC'},
	POSITION : {id : 100, type : 'POSITION'},
	PHOTO : {id : 200, type : 'PHOTO'},
	VIDEO  :{id : 300, type : 'VIDEO'},
	MUSIC  :{id : 400, type : 'MUSIC'},
};
},{}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\Frame.js":[function(require,module,exports){
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
},{"./Event.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Event.js","./EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\EventType.js","./GpsEvent.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\GpsEvent.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\GpsEvent.js":[function(require,module,exports){
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
},{"./Event.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Event.js","./EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\EventType.js","inherits":"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js":[function(require,module,exports){
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




},{}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\Smartresize.js":[function(require,module,exports){
(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
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
  }
    // smartresize 
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
},{}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\Story.js":[function(require,module,exports){
var Timeline = require('./Timeline.js');
var helper = require('./Helper.js')();
module.exports = Story;



/**
 * Class Story
 *  -  TIMELINE {
 *  	contiene i frames, ha dei metodi tipo
 *  		- getFrameAtX() // x= [time, percentage, index]
 *  		- getFramesFrom(start,end).each()
 *  		- getStart, getEnd
 *  		+ trim, add, 
 *  }
 *  -  EVENTPOOLER {
 *  	contiene la lista delle fonti
 *  	contiene una cache degli eventi scannati dalle varie fonti
 *  	quando carica un evento da una fonte lo trasforma in un Event
 *  	/**** POSSIBILE IMPLEMENTAZIONE : bind a browser event
 *   		ad ogni evento associa un trigger che risponde and un ev = requested timestart, timend, callback
 *   		quando un ev requested è lanciato, l'evento controlla se timestart e timend rientrano nel range e in caso esegue la callback
 * 		contiene dei metodi tipo
 * 		metodo principale : getEvents(start,end,callback){
 *   		trigger requested timestart timend callback     		
 * 		}
 * 	-  StoryUI - espone tutti i metodi per la visualizzazione (tipo getEvents, , )
 * 	-  StoryCrafter - espone tutti i metodi per modificare la storia (tipo setEvents, , )
 *  
 *  }
 *  
 * @param {[type]} opts [description]
 */
function Story(opts){
	this.opts = helper.extend({}, opts);
	if (!(this instanceof Story)) return new Story(this.opts);
	this.helper = helper;
	this.timeline = this.opts.timeline || new Timeline(this.opts.timelineOpts || {});
	this.title = this.opts.title || 'untitled story';
	this.description = this.opts.description || 'new story to be filled';
	this.author = this.opts.author || -1;
	this.participants = this.opts.participants || [];
	this.createdOn = this.opts.createdOn || this.helper.dateToString(new Date());
	return this;
}
},{"./Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js","./Timeline.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Timeline.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\StoryFactory.js":[function(require,module,exports){
var Story = require('./Story.js');
var helper = require('./Helper.js')();

module.exports = StoryFactory;
function StoryFactory(opts){
	if (!(this instanceof StoryFactory)) return new StoryFactory(opts);
	this.opts = helper.extend({
        name: 'Story Factory',
        id: 'StoryFactory'
    }, opts);
    this.name = opts.name;
    this.id = opts.id;
	return this;
}

StoryFactory.prototype.generate = function() {
	return new Story(this.opts);
};
},{"./Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js","./Story.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Story.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\Timeline.js":[function(require,module,exports){
var Frame = require('./Frame.js');
var helper = require('./Helper.js')();

module.exports = Timeline;

function Timeline(opts) {
    if (!(this instanceof Timeline)) return new Timeline(opts);
    this.scale = opts.scale || 1; // delta minutes between frames
    this.frames = opts.frames || [];
    this.start = opts.start || 0; // ms
    this.end = opts.end || 0; // ms
    this.events = opts.events || [];
    if (opts.saved) {} else {
        this.initialize();
    }
    return this;
}

/**
 * 1- crea l'array di Frame
 * @return list of events created during initialization
 */



Timeline.prototype.initialize = function() {
    var startMs = this.start.getTime();
    var endMs = this.end.getTime();
    var diffMs = endMs - startMs;
    var diffm = diffMs / 1000 / 60;
    var diffh = diffm / 60;
    var diffd = diffh / 24;
    var self = this; //things are gonna get messy
    var lat = GLOBALS.position.coords.latitude;
    var lng = GLOBALS.position.coords.longitude;


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

},{"./Frame.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Frame.js","./Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\Wizard.js":[function(require,module,exports){
var helper = require('./Helper.js')().get();

module.exports = Wizard;

function Wizard(title, steps, endCallback) {
    if (!(this instanceof Wizard)) return new Wizard(steps);
    this.title = title;
    this.steps = [];
    this.endCallback = endCallback;
    this.current = 0;
    this.Step = Step;
    this.getHelper = function(obj) {
        return new FormHelper(obj);
    };
    this.context = {};
    for (var i = 0; i < steps.length; i++) {
        this.steps.push(new this.Step(steps[i].data, steps[i].callback, steps[i].first, steps[i].last));
    }
    return this;
}
Wizard.prototype.show = function() {
    /*
        create the div, 
        append it to the body,
        return it for further manipolation
    */
};
Wizard.prototype.start = function() {
    this.current = 0;
    this.context = {};
    this.context.wizard = this;
    this.steps[this.current].go(this.context);
};
Wizard.prototype.next = function() {
    this.current++;
    this.steps[this.current].go(this.context);
};
Wizard.prototype.previous = function() {
    if (this.current === 0) return;
    this.context = this.steps[this.current].snapshot;
    this.current--;
    this.steps[this.current].go(this.context); // go(this.context) to save context also on previous ;
};
Wizard.prototype.reload = function() {
    this.steps[this.current].go(this.steps[this.current].getSnapshot());
};
Wizard.prototype.exit = function() {
    if (this.endCallback)
        this.endCallback(this.context);
};

function Step(_data, _cb, first, last) { //wraps a step of the wizard
    if (!(this instanceof Step)) return new Step(_cb);
    this.snapshot = {};
    this.data = _data;
    this.callback = _cb;
    this.last = last || false;
    this.first = first || false;
    return this;
}
Step.prototype.go = function(_context) { // <-- context comes from wizard
    var context = _context;
    this.snapshot = helper.deepCopy(context); // <-- save the context for rollback
    var self = this;
    var confirmButtonText = "next >>";
    if (self.last) {
        confirmButtonText = "done!";
    }
    setTimeout(
        function() {
            swwi({
                    title: context.wizard.title + "(" + (context.wizard.current + 1) + "/" + context.wizard.steps.length + ")",
                    text: self.data.text,
                    type: "info" || self.data.type,
                    showCancelButton: !self.first,
                    confirmButtonText: confirmButtonText,
                    closeOnConfirm: true
                }, function(isConfirm) {
                    context.calls = context.calls || 0;
                    context.calls++;
                    if (isConfirm) {
                        if (self.last) {
                            context.wizard.exit();
                        } else {
                            context.wizard.next();
                        }
                    } else {
                        context.wizard.previous();
                    }
                },
                function(handler) {
                    $(handler).html(''); //reset the custom div
                    self.callback(handler, context); // <-- pass context to the inner function of the step. 
                });
        }, 1000);


};
Step.prototype.getSnapshot = function(context) {
    return helper.deepCopy(this.snapshot); //<--return 
};


function FormHelper(handler) {
    if (!(this instanceof FormHelper)) return new FormHelper(handler);
    this.handler = handler;
    this.$form = $(document.createElement('form'));
    this.$handler = $(this.handler);
    this.$handler.append(this.$form);
    this.fields = [];
    return this;
}
FormHelper.prototype.focus = function() {
	this.fields[0].focus();
};

FormHelper.prototype.addField = function(label, value, field, onChange) {
    var _label = $(document.createElement('label')).html(label);
    this.$form.append(_label);
    this.$form.append(field);
    this.$form.append('<br>');
    this.fields.push(field);
    if (value) field.val(value);
    return this;
};

FormHelper.prototype.addTextField = function(label, value, onChange) {
    var _input = $(document.createElement('input')).attr('type', 'text').change(function() {
        onChange(_input.val());
    });
    return this.addField(label, value, _input, onChange);
};

FormHelper.prototype.addSelect = function(label, value, data, onChange) {
    var s = $('<select />');
    for (var val in data) {
        $('<option />', {
            value: val,
            text: data[val]
        }).appendTo(s);
    }
    s.change(function() {
        onChange(s.val());
    });    
    return this.addField(label, value, s, onChange);
};

FormHelper.prototype.addDateField = function(label, value, onChange) {
    var _input = $(document.createElement('input')).attr('type', 'text').change(function() {
        onChange(_input.val());
    });
    _input.datepicker();
    return this.addField(label, value, _input, onChange);
};

},{"./Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\engine\\SEngine.js":[function(require,module,exports){
module.exports = SEngine;

function SEngine(opts){
	if (!(this instanceof SEngine)) return new SEngine(opts);
	this.modules = {};

	return this;
};

/**
 * Start the engine
 * @param  {[type]} modules -- CLASS NAMES !!!!! NOT OBJECT
 * @return {[type]} this
 */
SEngine.prototype.start = function(modules) { //modules contains class name !!!!!
	for (var i = 0; i < modules.length; i++) {
		var smodule = modules[i];
		this.modules[smodule.name] = smodule.start();
		
	};
	
	return this;
};
},{}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\CustomClickModule.js":[function(require,module,exports){
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

},{".././EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\EventType.js",".././Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js",".././Smartresize.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Smartresize.js","././SModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\SModule.js","inherits":"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\DisplayPath.js":[function(require,module,exports){
var SModule = require('./SModule.js');
var inherits = require('inherits');
var smartresize = require('../Smartresize.js');
var helper = require('../Helper.js')();
var EventType = require('../EventType.js');

module.exports = DisplayPathModule;


function DisplayPathModule(opts) {
    if (!(this instanceof DisplayPathModule)) return new DisplayPathModule(opts);
    opts = helper.extend({
        name: 'DisplayPathModule',
        id: 'DisplayPathModule'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, opts);
    this.parent = opts.parent; // where the map will be displayed
    this.opts = opts;
    return this;
}

inherits(DisplayPathModule, SModule);

DisplayPathModule.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('DisplayPathModule started');
}

DisplayPathModule.prototype.clearPaths = function() {
    var gmm = this.required('gmm');
    if (gmm.polys) {
        for (var i = 0; i < gmm.polys.length; i++) {
            gmm.polys[i].setMap(null);
        };
    }
}
DisplayPathModule.prototype.addPath = function(map, points, color) {
    var gmm = this.required('gmm');
    if (!gmm.polys) gmm.polys = [];
    var pol = new google.maps.Polyline({
        path: points,
        strokeColor: color,
        strokeOpacity: 0.6,
        strokeWeight: 5
    });
    pol.setMap(map);
    gmm.polys.push(pol);
};
DisplayPathModule.prototype.consume = function(frame) {
    var self = this; //things are gonna get nasty
    var gmm = this.required('gmm');
    var ev = frame.getPositionEvent();
    this.clearPaths();
    if (ev && this.enabled) {        
        if (ev.interpolated) {
            self.addPath(gmm.map, [ev.prev.position, ev.next.position], '#FF0000');
        } else {
            self.addPath(gmm.map, ev.skipped.concat([ev.position]), '#000000');

        }
    }
}

},{"../EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\EventType.js","../Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js","../Smartresize.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Smartresize.js","./SModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\SModule.js","inherits":"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\GMapModule.js":[function(require,module,exports){
var SModule = require('./SModule.js');
var inherits = require('inherits');
var smartresize = require('../Smartresize.js');
var helper = require('../Helper.js')();
var EventType = require('../EventType.js');

module.exports = GMapModule;

/**
 * GMAP MODULE
 * !!! DOM NOT READY YET WHEN CALLED
 * manages integration with google maps
 *
 * @param {Object} opts
 */
function GMapModule(story, opts) {
    if (!(this instanceof GMapModule)) return new GMapModule(story, opts);
    opts = helper.extend({
        name: 'GMapModule',
        id: 'GMapModule'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, opts);
    this.parent = opts.parent; // where the map will be displayed
    this.mapOptions = {
        center: new google.maps.LatLng(41.54, 12.30),
        disableDefaultUI: true,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.mapOptions = helper.extend(this.mapOptions, opts.mapOptions || {});
    this.story = story; //story.js object
    this.opts = opts;
    return this;
}

inherits(GMapModule, SModule);

GMapModule.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('GMapModule started');
    this.$elector = $($("<div id='map-canvas'></div>"));
    this.parent.append(this.$elector);
    this.adjustSize();
    this.map = new google.maps.Map(document.getElementById('map-canvas'), this.mapOptions);



    var center;

    function calculateCenter() {
        center = self.map.getCenter();
    }
    google.maps.event.addDomListener(this.map, 'idle', function() {
        calculateCenter();
    });
    $(window).smartresize(function() {
        self.map.setCenter(center);
    });
    this.marker = new google.maps.Marker({
        position: this.mapOptions.center,
        map: this.map
    });
    return this;
};




GMapModule.prototype.adjustSize = function() {
    var $elector = this.$elector;
    helper.maximize($elector);
    $(window).smartresize(
        function() {
            helper.maximize($elector);
        });
};


GMapModule.prototype.consume = function(frame) {
    var self = this; //things are gonna get nasty
    var ev = frame.getPositionEvent();
    if (ev) {
        this.marker.setPosition(frame.getPositionEvent().position);


        if (this.editMode) { //in edit mode just move the mark

        } else {
            self.updatePosition(frame.getPositionEvent().position);

        }
    }
};



GMapModule.prototype.updatePosition = function(position, opt) {
    var options = opt || {};
    this.map.setCenter(position);
};









// this.debounce(
//     function() {
//         //console.info(self.name + '[' + self.id + ']' + ' updated ', frame);
//         //console.info(frame.getPosition());
//         self.updatePosition(frame.getPositionEvent().position);
//     }, 1000 / 33
// );

// console.info('frameTime: ' + helper.dateToString(new Date(ev.end_time)) + ' --- real time: ' + helper.dateToString(new Date(ev.real_time)));

//console.info('*****FRAME '+ev.index+' DUMP');
//console.info( ev.index + ') R: (' + ev.isReal + ') I: (' + ev.interpolated + ') - dT: (' + helper.deltaToString(ev.real_time - ev.end_time) + ')' );
//console.info(ev.prev.index + ' ---> ' + ev.index + (ev.interpolated ? '*' : '' ) + ' ---> ' + ev.next.index );

},{"../EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\EventType.js","../Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js","../Smartresize.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Smartresize.js","./SModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\SModule.js","inherits":"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\KMLImporter.js":[function(require,module,exports){
var SModule = require('././SModule.js');
var inherits = require('inherits');
var smartresize = require('.././Smartresize.js');
var helper = require('.././Helper.js')();
var EventType = require('.././EventType.js');

module.exports = KMLImporter;


function KMLImporter(story,opts) {
    if (!(this instanceof KMLImporter)) return new KMLImporter(story, opts);
    this.opts = helper.extend({
        name: 'KMLImporter',
        id: 'KMLImporter'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
	this.story = story;
    return this;
}

inherits(KMLImporter, SModule);

KMLImporter.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('KMLImporter started');
    this.win = this.createModalWindow(
        'Google Location Import Tool', // Title
        { //options
            id: '___KMLImporter',
            content: '<p style="font-size:0.8em">Drop KML here</p>', //html to be displayed
            resizable: false,
            modal: true,
            width: 200,
            height: 150,
            position: {
                top: '20px',
                left: '10px'
            }
        },
        this.UIedit); //parent div

    var myDropzone = new Dropzone("div#___KMLImporter", {
        url: "/uploadKML"
    });
    myDropzone.on("success", function(file, res) {
        //console.info(res);
        self.importKML(res);
    });
    myDropzone.on("complete", function(file) {

    });
    myDropzone.on("uploadprogress", function(file, progress) {

    });
    this.drop = myDropzone;
};

var KMLImporterBackend = require('./services/KMLService.js');
KMLImporter.prototype.importKML = function(res, opts) {
    var start = new Date(res.start)
    var end = new Date(res.end)
    if (this.story.timeline.start.getTime() > start.getTime()) {
        //console.info('need to extend start', this.story.timeline.start, start);
        this.story.timeline.extend(start, this.story.timeline.end);
    }
    if (this.story.timeline.end.getTime() < end.getTime()) {
        //console.info('need to extend end', this.story.timeline.end, end);
        this.story.timeline.extend(this.story.timeline.start, end);
    }
    console.info('Importing events ', res);
    var importer = new KMLImporterBackend(this);
    var events = importer.importGoogleLocation({
        postProcessing: [{
            func: importer.pp.fixNeighbours,
            opts: {
                name: 'fixNeighbours'
            }
        }, 
       {
            func: importer.pp.interpolator,
            opts: {
                name: 'interpolator',
                sensXY: 1000, //m
                sensT: 6 * 60 * 1000 // 3 min
            }
        }, 
        {
            func: importer.pp.reducer,
            opts: {
                name: 'reducer',
                sensXY: 100, //m if two events are one next to each other, merge them
            }
        ,
        }]
    }, res, this.story.timeline); //timeline is needed to get infos about frame, scale etc.etc.

    var real = 0;
    var num = 0;
    var interpolated = 0;
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        this.story.timeline.addEvent(event);
        num++;
        if (event.isReal) real++;
        if (event.interpolated) interpolated++;
    };
    console.info('**********END IMPORT KML************');
    console.info(this.story.timeline);
};

    KMLImporter.prototype.produce = function() {
        var self = this; //things are gonna get nasty
        self.consumers = self.consumers || [];
        if (self.enabled){
            for (var i = 0; i < this.consumers.length; i++) {
                this.consumers[i].consume({},'STORY_UPDATE');
            };
           }
    };
},{".././EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\EventType.js",".././Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js",".././Smartresize.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Smartresize.js","././SModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\SModule.js","./services/KMLService.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\services\\KMLService.js","inherits":"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\ModulesManager.js":[function(require,module,exports){
var SModule = require('./SModule.js');
var inherits = require('inherits');
var smartresize = require('../Smartresize.js');
var helper = require('../Helper.js')();
var EventType = require('../EventType.js');

module.exports = ModulesManager;


function ModulesManager(opts) {
    if (!(this instanceof ModulesManager)) return new ModulesManager(opts);
    opts = helper.extend({
        name: 'ModulesManager',
        id: 'ModulesManager'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, opts);
    this.parent = opts.parent; // where the UI will be displayed 
    this.opts = opts;
    return this;
}

inherits(ModulesManager, SModule);

ModulesManager.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('ModulesManager started');
    var self = this; //things are gonna get nasty
    //this.win -- this.win.$title -- this.win.$content
    this.win = this.createModalWindow(
        'ModulesManager', // Title
        { //options
            content: '', //html to be displayed
            resizable: false,
            modal: true,
            width: 200,
            height: 150
        },
        this.parent); //parent div

    var html = '<p style="font-size:0.8em">List of modules installed</p>';
    this.win.$content.html(html);
    /*BUILD THE UI*/
    this.checks = [];
    var ul = $('<ul style="list-style-type:none"></ul>');
    for (var i = 0; i < this.consumers.length; i++) {
        var module = this.consumers[i];
        var li = $("<li>" + module.name + "</li>");
        this.checks[i] = $('<input type="checkbox"></input>');
        this.checks[i].prop('val', i);
        li.prepend(this.checks[i]);
        this.checks[i].prop('checked', module.enabled);
        this.checks[i].click(function(el) {
            var index = $(el.target).prop('val');
            var module = self.consumers[index];
            module.toggle(self.checks[index].is(':checked'));
        });
        ul.append(li);
    };
    this.win.$content.append(ul);
    this.refresh();
}
ModulesManager.prototype.refresh = function() {
    var self = this; //things are gonna get nasty    
    for (var i = 0; i < this.consumers.length; i++) {
        var module = this.consumers[i];
        this.checks[i].prop('checked', module.enabled);
    }
    setTimeout(function() {
        self.refresh();
    }, 1500);
}

},{"../EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\EventType.js","../Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js","../Smartresize.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Smartresize.js","./SModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\SModule.js","inherits":"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\PlayBackModule.js":[function(require,module,exports){
var SModule = require('./SModule.js');
var inherits = require('inherits');
var smartresize = require('../Smartresize.js');
var helper = require('../Helper.js')();
var EventType = require('../EventType.js');

module.exports = PlayBackModule;


function PlayBackModule(clickModule, opts) {
    if (!(this instanceof PlayBackModule)) return new PlayBackModule(clickModule, opts);
    this.opts = helper.extend({
        name: 'PlayBackModule',
        id: 'PlayBackModule'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
    this.clickModule = clickModule;
    this.addProducer(this.clickModule);
    this.minSpeed = this.opts.minSpeed || 1;
    this.maxSpeed = this.opts.maxSpeed || 10;
    this.run = this.opts.autoStart || false;
    clickModule.start();
    return this;
}

inherits(PlayBackModule, SModule);

PlayBackModule.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('PlayBackModule  started');
    this.win = this.createModalWindow(
        'Playback', // Title
        { //options
            id: 'PlaybackWindows',
            content: '', //html to be displayed
            resizable: false,
            modal: true,
            width: 180,
            height: 150,
            position: {
                top: '50%',
                left: '40%'
            }
        },
        this.UIview); //parent div
    //this.win.width($(window).width());

    $(window).smartresize(function() {
        self.win.width($(window).width());
    });
    this.win.$content.append(this.createIcon('av:fast-rewind', function(btn, module) {
        self.clickModule.speed = Math.max(self.minSpeed, self.clickModule.speed - 1);
        //console.info(self.clickModule.speed);
    }));
    this.win.$content.append(this.createIcon('av:pause', function(btn, module) {
        self.togglePlay();
    }));
    this.win.$content.append(this.createIcon('av:fast-forward', function(btn, module) {
        self.clickModule.speed = Math.min(self.maxSpeed, self.clickModule.speed + 1);
        //console.info(self.clickModule.speed);
    }));
    $(document).keydown(function(e) {
        switch (e.which) {
            case 32: //space bar
                self.togglePlay();
                return;
            case 37: //left
                self.required('tmm').prevFrame();
                return;
            case 39: //right
                self.required('tmm').nextFrame();
                return;
            default:
                return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    return this;
}

PlayBackModule.prototype.togglePlay = function() {
    this.run = (!this.run);
}
PlayBackModule.prototype.consume = function(data) {
    var self = this; //things are gonna get nasty
    if (this.run)
        this.required('tmm').nextFrame();
}

},{"../EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\EventType.js","../Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js","../Smartresize.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Smartresize.js","./SModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\SModule.js","inherits":"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\SModule.js":[function(require,module,exports){
module.exports = SModule;
var inherits = require('inherits');
var helper = require('../Helper.js')();

function SModule(opts) {
    opts = opts || {};
    if (!(this instanceof SModule)) return new SModule(opts);
    this.opts = helper.extend({}, opts);
    /*Common ops*/
    this.started = false;
    this.enabled = opts.enabled || false;
    this.name = opts.name || 'Generic module';
    this.id = opts.id || 'SModule';
    this.postInit = opts.postInit || this.postInit;
    this.editMode = opts.editMode || false;
    this.requirement = opts.requirement || {};
    this.callbacks = opts.callbacks || {};
    this.UIedit = $("<div  id='UIedit_" + this.name + "'></div>");
    this.UIview = $("<div  id='UIview_" + this.name + "'></div>");

    this.consumers = [];

    return this;
};

/**
 * performs common operations
 *  - if callback is defined, then it is executed. //anonymous modules
 *  - if not, if the 'abstract' method postInit is executed. // modules extending this
 *
 * !!! args unchecked if you pass callback you have to pass params ({})
 *
 * @param {Map} opttions override the default [ name,  ]
 * @param  {Function} callback -- default is function(engine) {  return engine;  }
 * @return {[type]}
 */
SModule.prototype.start = function(callback) {
    this.started = true;
    $('#UI-EDIT').append(this.UIedit);
    $('#UI-VIEW').append(this.UIview);
    /*starts the module*/
    this.updateStatus();
    if (callback) {
        return callback(this);
    } else {
        return this.postInit();
    }
};

SModule.prototype.postInit = function() {
    if (this.callbacks && this.callbacks.postInit) {
        return this.callbacks.postInit();
    }
    console.warn('default post init called. is quite strange, isnt it?');
    console.info(this.name + '[' + this.id + ']' + ' started');
    return this;
};


SModule.prototype.toggle = function(newState) {
    this.enabled = newState || !this.enabled;
    this.updateStatus();
}
SModule.prototype.updateStatus = function() {
    if (!this.enabled) {
        this.UIedit.hide();
        this.UIview.hide();
    } else {
        this.UIedit.show();
        this.UIview.show();
    }
};



SModule.prototype.produce = function() {
    console.warn('default [produce] called by ' + this.name + '. is quite strange, isnt it?');
    for (var i = 0; i < this.consumers.length; i++) {
        this.consumers[i].consume({});
    };
};

SModule.prototype.consume = function(obj) {
    if (this.callbacks && this.callbacks.consume) { //Hookup to anonymous consumers passed in options
        return this.callbacks.consume(obj);
    }
    console.warn(this.name + ' default [consume] called. is quite strange, isnt it?', obj);
    return this;
};
SModule.prototype.addConsumer = function(module) {
    this.consumers.push(module);
    return this;
};
SModule.prototype.addProducer = function(source) {
    source.addConsumer(this);
    return this;
};
SModule.prototype.attachTo = function(source) {
    console.warn('SModule.attachTo is deprecated. Use SModule.addProducer instead');
    source.addConsumer(this);
    return this;
};
/**
 * Create an anon consumer module, to excecute a 
 * @param  {Function} callback [description]
 * @param  {[type]}   producer [description]
 * @return {[type]}            [description]
 */
SModule.prototype.bindToProducer = function(callback, producer) {
    var self = this; //things are gonna get nasty
    return new SModule({
        callbacks: {
            id: self.id + '_' + producer.id,
            name: 'bridge',
            consume: callback
        }
    }).addProducer(producer);
};






SModule.prototype.require = function(id, target) {
    this.requirement[id] = target;
    return this;
};
SModule.prototype.required = function(id) {
    if (!this.requirement[id]) console.error(id + ' required by ' + this.name);
    return this.requirement[id];
};


SModule.prototype.createTimelineUI = function(id, parent) {
    this.$timeline = $($('<div id="' + id + '" class="module_timeline"></div>'));
    parent.append(this.$timeline);
    this.$timeline.append("<span>" + id + "</span>");
    return this.$timeline;
};

SModule.prototype.getTimelineUI = function() {
    return this.$timeline;
};
SModule.prototype.createButton = function(text, callback) {
    var self = this; //things are gonna get nasty
    var html = '<div class="button raised green"><paper-ripple fit></paper-ripple></div>';
    var btn = $($(html));
    var text = $('<div class="label center" fit>' + text + '</div>');
    btn.append(text);
    btn.$text = text;
    btn.click(function() {
        callback(btn, self);
    });
    return btn;
};
SModule.prototype.createIcon = function(iconClass, callback) {
    var self = this; //things are gonna get nasty
    var html = '<div class="icon-button red"><core-icon icon="'+iconClass+'"></core-icon><paper-ripple class="circle recenteringTouch" fit></paper-ripple></div>';
    var btn = $($(html));
    btn.click(function() {
        callback(btn, self);
    });
    return btn;
};
SModule.prototype.createModalWindow = function(title, opts, parent) {
    opts.content = opts.content || "";
    var id = opts.id || new Date().getTime();
    var w = opts.width || 300;
    var h = opts.height || 300;

    var win = $($("<div id=" + id + " class='modal-window raised grey'></div>"));
    var title = $($("<div class='title raised blue'>" + title + "</div>"));
    var content = $($("<div class='content'>" + opts.content + "</div>"));
    win.width(w);
    win.append(title);
    win.append(content);
    var position = opts.position || {
        top: helper.randomInt(10, $(window).height() - 200) + 'px',
        left: helper.randomInt(10, $(window).width() - 200) + 'px'
    };
    if (position.top) win.css('top', (position.top));
    if (position.left) win.css('left', (position.left));
    if (position.rigth) win.css('rigth', (position.rigth));
    if (position.bottom) win.css('bottom', (position.bottom));
    parent.append(win);
    if (opts.resizable) {
        win.height(h);
        win.resizable({
            minHeight: win.height(),
            minWidth: win.width()
        });

    }

    if (opts.modal) {
        win.draggable({
            handle: ".title",
            containment: "window",
            stop: function() {
                if (win.offset().left === 0 || win.offset().top === 0) {
                    win.addClass('docked-left');
                } else {
                    win.removeClass('docked-left');

                }
            }
        });
    }

    win.$title = title;
    win.$content = content;

    return win;
};


},{"../Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js","inherits":"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\SourcesManager.js":[function(require,module,exports){
var SModule = require('./SModule.js');
var inherits = require('inherits');
var smartresize = require('../Smartresize.js');
var helper = require('../Helper.js')();
var EventType = require('../EventType.js');

module.exports = SourceManager;


function SourceManager(opts) {
    if (!(this instanceof SourceManager)) return new SourceManager(opts);
    opts = helper.extend({
        name: 'SourceManager',
        id: 'SourceManager'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, opts);
    this.listeners = [];
    return this;
}

inherits(SourceManager, SModule);

SourceManager.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('SourceManager started');
    this.win = this.createModalWindow(
        'SourceManager', // Title
        { //options
            content: '', //html to be displayed
            resizable: false,
            modal: true,
            width: 400,
            height: 150
        },
        this.UIedit); //parent div
    this.refresh();
}
SourceManager.prototype.refresh = function() {
    var self = this; //things are gonna get nasty
    var html = '<p style="font-size:0.8em">List of sources modules installed</p>';
    this.win.$content.html(html);
    var ul = $('<ul style="list-style-type:none"></ul>');
    for (var i = 0; i < this.listeners.length; i++) {
        var module = this.listeners[i];
        var li = $("<li>" + module.name + "</li>");
        var check = $('<input type="checkbox"></input>');
        check.prop('val', i);
        li.prepend(check);
        check.prop('checked', module.enabled);

        check.click(function(el) {
            self.listeners[$(el.target).prop('val')].toggle(check.is(':checked'));
            setTimeout(function() {
                self.refresh();
            }, 500);
        });

        var linker = $("<div style='display:inline'><img val = '" + i + "' src='./icon/content/svg/ic_link_24px.svg'></div>");
        li.append(linker);
        linker.module = module;
        linker.click(linkFB(linker));
        ul.append(li);
    };
    this.win.$content.append(ul);

}

var linkFB = function(linker) {
    var obj = linker;
    return function(el) {        
        obj.module.search();
    }
}

},{"../EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\EventType.js","../Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js","../Smartresize.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Smartresize.js","./SModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\SModule.js","inherits":"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\TimelineModule.js":[function(require,module,exports){
var SModule = require('./SModule.js');
var inherits = require('inherits');
var helper = require('../Helper.js')();
var smartresize = require('../Smartresize.js');

module.exports = TimelineModule;

/**
 * Timeline module. -- PRODUCER --
 * Create a timeline UI interface
 *
 *
 * @param {Object} opts
 */
function TimelineModule(story, opts) {
    if (!(this instanceof TimelineModule)) return new TimelineModule(opts);
    this.opts = helper.extend({
        name: 'TimelineModule',
        id: 'TMM'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
    this.opts.edit = this.opts.edit || false;
    this.opts.view = this.opts.view || false;
    this.current = 0; //index of the current frame
    this.story = story; //story.js object
    var self = this; //things are gonna get nasty
    $(document).keydown(function(e) {
        switch (e.which) {
            case 37: // left
                //self.goToFrame(self.current - 1);
                break;

            case 38: // up
                break;

            case 39: // right
                //self.goToFrame(self.current + 1);
                break;

            case 40: // down
                break;

            default:
                return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    return this;
}
inherits(TimelineModule, SModule);


/**
 * DOM READY HERE
 * @return {[type]} [description]
 */
TimelineModule.prototype.postInit = function() {
    //console.info('TimelineModule started', this.story.timeline);
    var self = this; //things are gonna get nasty
    console.info('TimelineModule  started');
    /*CREATE AND APPEND THE MODULE UI*/
    this.$timeline = $($('<div class="module_timeline"></div>'));
    this.$timeline.show();
    this.$dragger = $($('<div class="draggable"></div>'));
    this.$timeline.append(this.$dragger);    
    
    if (this.opts.edit && !this.opts.view){// edit true, view false
        
        this.UIedit.append(this.$timeline);
    }else if (!this.opts.edit && this.opts.view){ // view true, edit false
        this.UIview.append(this.$timeline);
    }else if (!this.opts.edit && !this.opts.view){//both false, default
        this.UIedit.append(this.$timeline);
    }else{ //Both true
        this.UIview.parent().parent().append(this.$timeline);
    }
    
    this._bk = 0;
    $(window).smartresize(function() {
        self.$dragger.refresh();
    });
    this.$dragger.getMaxPx = function() {
        return (self.$timeline.width() - self.$dragger.width());
    };
    this.$dragger.getPosition = function() {
        return (100 * (self.$dragger[0].offsetLeft / self.$dragger.getMaxPx()).toFixed(10));
    };
    this.$dragger.setPosition = function(percentage) {
        var offset = (percentage / 100) * self.$dragger.getMaxPx();
        self.$dragger.css('left', offset);
    };
    this.$dragger.refresh = function() {
        var index = self.current;
        self.$dragger.setPosition(self.story.timeline.getPercAtFrame(self.current, 10)); //In case the frame is changed,update position
    };
    this.$dragger.draggable({
        containment: "parent",
        drag: function(event) {
            self.current = self.story.timeline.getFrameAtPerc(self.$dragger.getPosition()).index;
            self.produce();
        },
        stop: function() {
            self.current = self.story.timeline.getFrameAtPerc(self.$dragger.getPosition()).index;
            self.produce();
        }
    });
    this.dateDisplay = $("<span></span>");
    this.$dragger.append(this.dateDisplay);


   this.goToFrame(0);
    return this;


};
TimelineModule.prototype.goToFrame = function(index) { //TODO: implementare bene
    var self = this; //things are gonna get nasty
    self.current = Math.max(0, Math.min(index, self.story.timeline.steps - 1));;
    self.produce();
};
TimelineModule.prototype.nextFrame = function() { //TODO: implementare bene
    var self = this; //things are gonna get nasty
    self.current = Math.max(0, Math.min(self.current + 1, self.story.timeline.steps - 1));;
    self.produce();
};
TimelineModule.prototype.prevFrame = function() { //TODO: implementare bene
    var self = this; //things are gonna get nasty
    self.current = Math.max(0, Math.min(self.current -1 , self.story.timeline.steps - 1));;
    self.produce();
};
TimelineModule.prototype.pickFrame = function() {
    var self = this; //things are gonna get nasty
    return self.story.timeline.frames[self.current];
};
TimelineModule.prototype.produce = function() {
    var frame = this.pickFrame();
    if (frame) {
        for (var i = 0; i < this.consumers.length; i++) {
            var listener = this.consumers[i];
            listener.consume(frame, 'FRAME');
        }
        this.$dragger.refresh();
        //this.dateDisplay.html(helper.dateToString(new Date(frame.time)) + '(' + frame.index + ')');
        this.dateDisplay.html(helper.dateToString(new Date(frame.time)));
    }
    return this;
};



TimelineModule.prototype.togglePlay = function() {
    var self = this; //things are gonna get nasty
    if (self.playbackTimeout) clearTimeout(self.playbackTimeout); //remove previous timeout
    if (!self.playback) self.playback = false;
    self.playback = !self.playback;
    if (self.playback) {
        self.playbackTimeout = setTimeout(function() {
            self.autoplay();
        }, 500);
    } else {
        self.playbackTimeout = null;
    }
};

TimelineModule.prototype.autoplay = function() {
    var self = this; //things are gonna get nasty
    self.goToFrame(self.current + 1);
    if (self.playback)
        self.playbackTimeout = setTimeout(function() {
            self.autoplay();
        }, 500);
};

},{"../Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js","../Smartresize.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Smartresize.js","./SModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\SModule.js","inherits":"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\UI\\UISwitcher.js":[function(require,module,exports){
var SModule = require('./../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../Smartresize.js');
var helper = require('../../Helper.js')();
var EventType = require('../../EventType.js');

module.exports = UISwitcherModule;


function UISwitcherModule(opts) {
    var self = this; //things are gonna get nasty
    if (!(this instanceof UISwitcherModule)) return new UISwitcherModule(opts);
    opts = helper.extend({
        name: 'UISwitcherModule',
        id: 'UISwitcherModule'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, opts);
    this.parent = opts.parent; // where the controls will be displaye
    return this;
}

inherits(UISwitcherModule, SModule);

UISwitcherModule.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    //this.win -- this.win.$title -- this.win.$content
    this.win = this.createModalWindow(
        'Mode switcher', // Title
        { //options
            content: '<p style="font-size:0.8em">Click the button to switch between edit mode and view mode</p>', //html to be displayed
            resizable: false,
            modal: true,
            width: 200,
            height: 150,
            position: {
                top: '10px',
                left: '70%'
            }
        },
        this.parent); //parent div
    var isEditMode = self.UIedit.parent().hasClass('active');
    this.win.$content.append(($('<span>' + 'Switch to ' + '</span>')));
    this.win.$content.append(
        this.createButton(isEditMode ? 'VIEW' : 'EDIT',
            function(btn, module) {
                self.UIedit.parent().toggleClass("active");
                self.UIview.parent().toggleClass("active");
                $(btn).removeClass('red');
                $(btn).removeClass('green');
                btn.$text.html(self.UIedit.parent().hasClass('active') ? 'VIEW' : 'EDIT');
                $(btn).addClass(self.UIedit.parent().hasClass('active') ? 'green' : 'red');
            })
    );
    return this;
};


},{"../../EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\EventType.js","../../Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js","../../Smartresize.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Smartresize.js","./../SModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\SModule.js","inherits":"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\services\\KMLService.js":[function(require,module,exports){
module.exports = KMLService;
var helper = require('../../Helper.js')();
/**
 * GMAP MODULE
 * !!! DOM NOT READY YET WHEN CALLED
 * manages integration with google maps
 *
 * @param {Object} opts
 */
var LOCAL = {};

function KMLService(parent, opts) {
    var self = this; //things are gonna get nasty
    this.parent = parent;

    this.pp = {};
    /**
     * go trough the events.
     *     for each events sets ev.prev and ev.next
     *     for each event x, search the followers, until it finds a real one.
     *     then x.next is set as the latter
     * @param  {[type]} events [description]
     * @return {[type]}        [description]
     */
    this.pp.fixNeighbours = function(opts, events) {
        var now = new Date().getTime();
        console.info('*** postProcessing fixNeighbours started');
        for (var i = 0; i < events.length; i++) {
            if (i > 0) {
                for (var y = i - 1; y >= 0; y--) { //fix prev
                    var prev = events[y];
                    if (prev.isReal) {
                        events[i].prev = prev;
                        events[i].postProcessingInfo.push('fixNeighbours - fixed prev');
                        break;
                    }
                }
            } else {
                events[0].prev = events[0];
            }
            if (i < events.length - 1) {
                for (var y = i + 1; y < events.length; y++) { //fix next
                    var succ = events[y];
                    if (succ.isReal) {
                        events[i].next = succ;
                        events[i].postProcessingInfo.push('fixNeighbours - fixed succ');
                        break;
                    }
                };
            } else {
                events[events.length - 1].next = events[events.length - 1];
            }
        };
        console.info('*** postProcessing fixNeighbours ended in ' + (new Date().getTime() - now) + 'ms');
        return events;
    }; // fix neighbours 
    /**
     * if event
     *     !isReal && //we don't have a relevation in the frame time slot
     *     delta_meters(next,prev) > threshold1 && // we interpolate only if the 'user' has moved (not sleeping)
     *     delta_time(next,prev) > threshold2 //we interpolate only ove rthreshold
     * @param  {[type]} opts   [description]
     * @param  {[type]} events [description]
     * @return {[type]}        [description]
     */
    this.pp.interpolator = function(opts, events) {
        var interpolate = function(ev, pre, post) {
            var time = (ev.end_time + ev.start_time) / 2;
            var newLat = helper.easeInOutQuad(
                Number(time - pre.real_time), //elapsed -- steps 
                Number(pre.position.lat()), //
                Number(post.position.lat()) - Number(pre.position.lat()),
                Number(post.real_time) - Number(pre.real_time)
            );
            var newLng = helper.easeInOutQuad(
                Number(time - pre.real_time), //elapsed -- steps 
                Number(pre.position.lng()), //
                Number(post.position.lng()) - Number(pre.position.lng()),
                Number(post.real_time) - Number(pre.real_time)
            );
            ev.interpolated = true;
            ev.position = new google.maps.LatLng(newLat, newLng);

            var dist = helper.distance(
                events[ev.index - 1].position,
                ev.position
            ).toFixed(2); //distance INTERPOLATED (distance from the previous event, whether real or not)
            ev.speed = {
                ms: ((dist/60) / ev.scale).toFixed(2),
                kmh: (3.6 * (dist/60) / ev.scale).toFixed(1)
            };
            events[i].postProcessingInfo.push('interpolator - interpolated');
        };


        var th_meters = opts.sensXY || 3; //x meters * minute
        var th_time = opts.sensT || 2 * 60 * 60 * 1000; //2 hours
        for (var i = 0; i < events.length; i++) {
            var ev = events[i];
            if (!ev.isReal) {
                var distance = helper.distance(ev.next.position, ev.prev.position);
                var elapsed = ev.next.real_time - ev.prev.real_time;
                if ((th_meters * ev.scale) <= distance) {
                    if ((th_time) <= elapsed) {
                        interpolate(ev, ev.prev, ev.next);
                    }
                }
            }
        };
        return events;
    }; // interpolate 

    this.pp.reducer = function(opts, events) {
        return events;
    }; // interpolate 



    return self;
}
var GpsEvent = require('../../GpsEvent.js');
KMLService.prototype.importGoogleLocation = function(opts, values, timeline) {
    var self = this; //things are gonna get nasty
    var events = [];
    var lastIndex = 0;
    var frames = timeline.frames;
    var gevents = values.ret;
    /*RAW IMPORT*/
    var index = 0;
    var ev = new GpsEvent({
        position: new google.maps.LatLng(gevents[lastIndex].where.lat, gevents[lastIndex].where.lng),
        start_frame: 0,
        end_frame: 0,
        start_time: frames[0].time,
        end_time: frames[0].time + timeline.getMsStep(),
        real_time: new Date(gevents[0].when).getTime(),
        subtype: '__google'
    });
    ev.postProcessingInfo = [];
    ev.scale = timeline.scale;
    ev.index = index++;
    events.push(ev);
    lastIndex = 1;
    var between = function(_date, _start, _end) {
        return _date >= _start && _date <= _end;
    }
    for (var i = 1; i < frames.length; i++) { //cycle through all frames
        var frameTime = frames[i].time;
        var skipped = 0;
        var skippedPoints = [];
        for (var y = lastIndex; y < gevents.length; y++) {

            var valTime = new Date(gevents[y].when).getTime();
            if (valTime <= frameTime) {
                skipped++;
                skippedPoints.push(new google.maps.LatLng(gevents[y].where.lat, gevents[y].where.lng));
            } else {
                var dist = helper.distance(
                    new google.maps.LatLng(gevents[lastIndex].where.lat, gevents[lastIndex].where.lng),
                    new google.maps.LatLng(gevents[y].where.lat, gevents[y].where.lng)
                ).toFixed(2);
                lastIndex = y;
                var real_time = new Date(gevents[lastIndex].when).getTime();
                var included = between(real_time, frameTime, frameTime + timeline.getMsStep());
                //found the first event after the frame. add an event with the info from the event before

                var ev = new GpsEvent({
                    position: new google.maps.LatLng(gevents[lastIndex].where.lat, gevents[lastIndex].where.lng),
                    real_time: real_time,
                    isReal: included,
                    start_frame: i,
                    end_frame: i,
                    start_time: frameTime,
                    end_time: frameTime + timeline.getMsStep(),
                    subtype: '__google',
                    distance: dist,
                    speed: {
                        ms: ((dist/60) / timeline.scale).toFixed(2),
                        kmh: (3.6 * (dist/60) / timeline.scale).toFixed(1),
                    },
                    skipped: skippedPoints,
                });
                ev.postProcessingInfo = [];
                ev.scale = timeline.scale;
                ev.index = index++;
                events.push(ev);
                //console.info(i, '/', frames.length, ' skipped ', skipped, 'real: ', real, ' delta (', helper.deltaToString(ev.real_time - ev.end_time) ,')');
                //console.info(i, included, ev.isReal, helper.deltaToString(ev.real_time - ev.end_time) );
                break;
            }
        }
    }
    if (opts.postProcessing) {
        for (var i = 0; i < opts.postProcessing.length; i++) {
            console.info(events.length, 'calling post processor', opts.postProcessing[i].opts.name);
            events = opts.postProcessing[i].func(opts.postProcessing[i].opts, events);
        };
    }
    return events;
};

},{"../../GpsEvent.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\GpsEvent.js","../../Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js"}],"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\sources\\FacebookSourcesModule.js":[function(require,module,exports){
var SModule = require('./../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../Smartresize.js');
var helper = require('../../Helper.js')();
var EventType = require('../../EventType.js');

module.exports = FacebookSourcesModule;


function FacebookSourcesModule(opts) {
    if (!(this instanceof FacebookSourcesModule)) return new FacebookSourcesModule(opts);
    opts = helper.extend({
        name: 'FB Source Digger',
        id: 'FacebookSourcesModule'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, opts);
    this.story = opts.story;
    return this;
}

inherits(FacebookSourcesModule, SModule);

FacebookSourcesModule.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('FacebookSourcesModule started');
}

FacebookSourcesModule.prototype.search = function(first_argument) {
    console.info('searching events from ' + helper.msToString(this.story.timeline.start) + ' to ' + helper.msToString(this.story.timeline.end));

    var searchFunction = function(path) {
    	var limit = 5;
        hello("facebook").api(path, {
            limit: 100
        }).on('success', function callback(resp) {
        	if (0 == limit-- )return;
            if (resp.paging && resp.paging.next) {
            	//console.info("Found " + resp.data.length + ". events. Keep going.",resp.data);
            	for (var i = 0; i < resp.data.length; i++) {
            		var obj = resp.data[i];
            		console.info(obj.story, helper.dateToString(new Date(obj.created_time)));
            	};
            	searchFunction(resp.paging.next);                
            } else {
                console.info("Found " + resp.data.length + ".",resp.data);
            }
        }).on('error', function() {
            console.error("Whoops!");
        });
    }
    searchFunction("/me/share");


};

},{"../../EventType.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\EventType.js","../../Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js","../../Smartresize.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Smartresize.js","./../SModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\SModule.js","inherits":"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js"}],"C:\\workspaces\\github\\storify\\js\\storify.js":[function(require,module,exports){

var Storify = {}; //namespace
var helper = require('./src/storify/Helper.js')();
var StoryFactory = require('./src/storify/StoryFactory.js');

init = function(_GLOBALS) {
    GLOBALS = _GLOBALS;
    var goSocial = false;
    if (goSocial) {
        GLOBALS.usm.start(false)
            .login({
                method: 'facebook'
            }, function success(user) {
                console.info("You are signed in to Facebook");
                console.info(user);
                $('#profilepic').css('background-image', 'url(' + user.picture + ')');
                GLOBALS.usm.getPosition(function(err, position) {
                    GLOBALS.position = position || {
                        coords: {
                            latitude: 0,
                            longitude: 0
                        }
                    };
                    startStorify(null, user);
                }, 5000);
            }, function failure(err) {
                console.info(err, null);

            });
    } else {
        GLOBALS.position = {
            coords: {
                latitude: 0,
                longitude: 0
            }
        };
        startStorify(null, null);
    }
};

//require Story --> Timeline --> Frame --> Event
var Story = require('./src/storify/Story.js');
var StoryFactory = require('./src/storify/StoryFactory.js');
var Wizard = require('./src/storify/Wizard.js');
var SEngine = require('./src/storify/engine/SEngine.js');
var SModule = require('./src/storify/modules/SModule.js');
var GMapModule = require('./src/storify/modules/GMapModule.js');
var SModule = require('./src/storify/modules/SModule.js');
var ModulesManager = require('./src/storify/modules/ModulesManager.js');
var CustomClickModule = require('./src/storify/modules/CustomClickModule.js');
//SOURCES
var SourcesManager = require('./src/storify/modules/SourcesManager.js');
var PlayBackModule = require('./src/storify/modules/PlayBackModule.js');

var TimelineModule = require('./src/storify/modules/TimelineModule.js');
var EditSwitch = require('./src/storify/modules/UI/UISwitcher.js');

var DisplayPathModule = require('./src/storify/modules/DisplayPath.js');
var FacebookSourcesModule = require('./src/storify/modules/sources/FacebookSourcesModule.js');

var KMLImporter = require('./src/storify/modules/KMLImporter.js');

var startStorify = function(err, user) {
    if (err) {
        swal({
            title: "Error",
            text: "Facebook login is required for this experiment!",
            type: "error",
            confirmButtonText: "too bad :("
        });
        return;
    } else {

        var story = new StoryFactory({
            title: 'USA',
            description: '#Roadtrip #California #Nevada #Burningman',
            timelineOpts: {
                start: new Date('09/01/2014'),
                end: new Date('09/02/2014'),
                scale: 1 //1 frame every 10 minutes.
            },
        }).generate();
        //console.info($.toJSON(story));
        console.info(story);

        /*CREATE MODULES*/
        /*SUPERMODULES*/
        var uiSwitcher = new EditSwitch({ //Move marker, show map ecc.ecc.
            parent: $('#main'),enabled:true
        });
        var mm = new ModulesManager({
            parent: $('#UI-EDIT'),enabled:true
        });
        /*SOURCES*/
        var sm = new SourcesManager({enabled:false}).addProducer(mm);
        var fsm = new FacebookSourcesModule({story:story, enabled:false}).addProducer(sm);

        /*TIMELINE*/
        var importer = new KMLImporter(story, {
            enabled: true
        });
        var tmm = new TimelineModule(story, {enabled:true, edit:true, view:true}).addProducer(mm); //edit timeline module
        /*EDIT*/

        var gmm = new GMapModule(story, { //Move marker, show map ecc.ecc.
            parent: $('#main'),enabled:false
        })
        .addProducer(tmm).require('tmm', tmm);

        //attached to modules manager, attached to timeline, require google maps 
        var displayPath = new DisplayPathModule({ //Move marker, show map ecc.ecc.
            parent: $('#main'),
            enabled:true
        }).addProducer(mm).addProducer(tmm).require('gmm', gmm); 


        /*VIEW*/
        var playback = new PlayBackModule(
            new CustomClickModule(1  , {enabled: true, autoStart:false}),
            {enabled:true, maxSpeed: 15}
        ).require('tmm', tmm);
        
        /*CLOCK ON TOP*/
        var timezoneadj = - 8 *( 1000 * 60 * 60);
        var dateDisplayer = new SModule({
            enabled: true,
            name: 'dateDisplayer',
            callbacks: {
                postInit: function() {
                    $('#UI-VIEW').prepend('<div class="button raised grey" style="width:300px;height:30px;position:absolute;margin-left:-100px;top:50px;left:50%;text-align:center;font-size: xx-large;font-family: sans-serif" id="__clock_V"></div>');
                    $('#UI-EDIT').prepend('<div class="button raised grey" style="width:300px;height:30px;position:absolute;margin-left:-100px;top:50px;left:50%;text-align:center;font-size: xx-large;font-family: sans-serif" id="__clock_E"></div>');
                },
                consume: function(frame) { 
                    var  time = frame.time + (timezoneadj);
                    $('#__clock_V').html(helper.msToString(time));
                    $('#__clock_E').html(helper.msToString(time));
                }
            }
        }).addProducer(tmm);
        var speedDisplayer = new SModule({
            enabled: true,
            name: 'dateDisplayer',
            callbacks: {
                postInit: function() {
                    $('#UI-VIEW').prepend('<div class="button raised grey" style="width:300px;height:30px;position:absolute;bottom:10%;left:0%;text-align:center;font-size: xx-large;font-family: sans-serif" id="__speed_V"></div>');  
                },                 
                consume: function(frame) {
                    var posev = frame.getPositionEvent();
                    if (posev && posev.speed){
                        var s = posev.isReal ? '' : '*';
                        $('#__speed_V').html(posev.speed.kmh + ' km/h' + s);
                    }
                    
                }
            }
        }).addProducer(tmm);

        /*POSTINIZIALIZER*/
        var postInitializer = new SModule({
            name: 'onTheRockModule',
            id: 'ONTHEROCK',
            postInit: function() {
                console.info('All modules started');
                return this;
            }
        });

        var engine = new SEngine().start(
            [ //MODULES
                /*GENERAL PURPOSE MODULES*/
                mm, //module manager
                uiSwitcher, // switch between edit and view

                /*SOURCE // EDITORS // */
                sm, //sources manager
                fsm, //facebook source module
                importer, //KMLImporter
                tmm, //timeline


                /*VIEW*/                
                gmm, //google maps
                playback, //playback bar 
                displayPath, //display interpolated paths and skipped events on gmap
                dateDisplayer,
                speedDisplayer,
                postInitializer // anonymous module on complete
            ]
        );

    }
};









/*SKIP WIZARD NOW
        if (false) {
            swal({ //WELCOME PAGE
                title: "Welcome " + user.first_name,
                text: "Here you will create your first story.\n Are you ready?",
                type: "success",
                confirmButtonText: "Can't wait to tell a Story!",
                closeOnConfirm: true
            }, function() {
                new Wizard('Create a story', [step1], //, step2, step3], //STEPS
                    function(context) { //FUNCTION TO BE EXCECUTED AT THE END OF THE WIZARD
                        GLOBALS.pb.set(100);

                        console.info(new Story({
                            author: user.id
                        }));
                        console.info(context);
                    }).start();
            });
        }


var step1 = {
    first: true,
    last: true,
    data: {
        text: ''
    },
    callback: function(obj, context) {
        GLOBALS.pb.set(10);
        context.title = 'My first story';
        context.wizard.getHelper(obj)
            .addTextField('Title', context.title, function(value) {
                context.title = value;
            })
            .addTextField('Description', context.description, function(value) {
                context.description = value;
            })
            .addDateField('From', context.from, function(value) {
                context.from = value;
            }).addDateField('To', context.to, function(value) {
                context.to = value;
            }).focus();
        console.info(obj, context);
    }
};
require()

var step2 = {
    data: {
        text: 'step 2'
    },
    callback: function(obj, context) {
        GLOBALS.pb.set(20);
        context.variable++;
        console.info(obj, context);

    }
};
var step3 = {
    last: true,
    data: {
        text: 'step 3'
    },
    callback: function(obj, context) {
        GLOBALS.pb.set(30);
        context.variable = 200;
        console.info(obj, context);
    }
};


*/









/*
var test = require('./src/test');
var SGUI = require('./src/SGUI');
var SStory = require('./src/SStory');
var EventBus = require('./src/EventBus');




function S(opts) {
    var self = this;
    opts = opts || {};
    if (!(this instanceof S)) return new S(opts);
   	this.bus = new EventBus(this,{});
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
*/
},{"./src/storify/Helper.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Helper.js","./src/storify/Story.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Story.js","./src/storify/StoryFactory.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\StoryFactory.js","./src/storify/Wizard.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\Wizard.js","./src/storify/engine/SEngine.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\engine\\SEngine.js","./src/storify/modules/CustomClickModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\CustomClickModule.js","./src/storify/modules/DisplayPath.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\DisplayPath.js","./src/storify/modules/GMapModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\GMapModule.js","./src/storify/modules/KMLImporter.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\KMLImporter.js","./src/storify/modules/ModulesManager.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\ModulesManager.js","./src/storify/modules/PlayBackModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\PlayBackModule.js","./src/storify/modules/SModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\SModule.js","./src/storify/modules/SourcesManager.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\SourcesManager.js","./src/storify/modules/TimelineModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\TimelineModule.js","./src/storify/modules/UI/UISwitcher.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\UI\\UISwitcher.js","./src/storify/modules/sources/FacebookSourcesModule.js":"C:\\workspaces\\github\\storify\\js\\src\\storify\\modules\\sources\\FacebookSourcesModule.js"}],"C:\\workspaces\\github\\storify\\node_modules\\inherits\\inherits_browser.js":[function(require,module,exports){
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

},{}]},{},["C:\\workspaces\\github\\storify\\js\\storify.js"]);
