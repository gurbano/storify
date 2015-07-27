var test = require('./src/test');
var SGUI = require('./src/SGUI_EDIT');
var SStory = require('./src/SStory');
var EventBus = require('./src/EventBus');
var KMLImporterBackend = require('./src/KmlService');
var GpsEvent = require('./src/GpsEvent.js');
var PhotoEvent = require('./src/PhotoEvent.js');
var EventType = require('./src/EventType.js');
var helper = require('./src/helper.js')();

function S(opts) {
    var self = this;
    opts = opts || {};
    if (!(this instanceof S)) return new S(opts);
   	this.bus = new EventBus(this,{});
    //this.datgui = new dat.GUI();
    
    this.story = new SStory(this, {
    	startTime : new Date().getTime(),
    	endTime : new Date("1/1/1900").getTime()}
	);
    this.sgui = new SGUI(this,{});
    this.subscribe = function(obj, event, fn) {
        self.bus.subscribe(obj, event, fn);
    };
    this.unsubscribe = function(obj, event, fn) {
        self.bus.unsubscribe(event, fn);
    };
    this.publish = function(event, params) {
        self.bus.publish(event, params);
    };

    /*APPLICATION CONFIGURATION
        subscribe to the events
        keep all subscribe here
    */
    this.subscribe(self,'EVENT.GUI.KMLUPLOADED',function(params){
        var importer = new KMLImporterBackend(self);
        self.story.importKmlEvents(params.ret);
        var _events = importer.importGoogleLocation({/*
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
                    sensXY: 100, //m
                    sensT: 30 * 60 * 1000 // 6 min
                }
            }, 
            {
                func: importer.pp.reducer,
                opts: {
                    name: 'reducer',
                    sensXY: 10, //m if two events are one next to each other, merge them
                }
            ,
            }]
        */}, params, self.sgui.kmlTimeline); //timeline is needed to get infos about frame, scale etc.etc.
        
        self.publish('EVENT.STORY.REFRESH.KML',{events: _events});
    });
    /*WHEN A PHOTO IS UPLOADED, TURN INTO EVENT AND ADD IT TO THE PHOTO TIMELINE*/
    this.subscribe(self,'EVENT.GUI.PHOTOUPLOADED',function(params){
        var path = params.path;
        var exif = params.exif.exif;
        var time = helper.stringToDate(exif.DateTimeOriginal,helper.EXIF_DATE).getTime();
        var frame = self.sgui.photoTimeline.getFrameAtTime(time);
        var ev = new PhotoEvent({
            start_time : time,
            end_time : time,
            name: path,
            start_frame : frame.index,
            end_frame : frame.index
        });
        self.sgui.photoTimeline.addEvent(ev);
        self.publish('EVENT.STORY.REFRESH.PHOTO',{events: [ev]});
    });
    this.subscribe(self,'EVENT.STORY.REFRESH.PHOTO',function(params){
        var events = params.events;
        var that = self.sgui.photoTimeline;
        /*RENDER PHOTO JUST ADDED - to be moved inside the timeline code*/
        var leftoff = 0;
        var rightoff = 0;
        for (var i = that.frames.length - 1; i >= 0; i--) {
            var tmpFrame = that.frames[i];
            var width = that.div.width() - leftoff - rightoff;
            var height = that.div.height();
            var offset = i/that.frames.length;
            var offsetPx = Math.floor(offset * width) + leftoff;
            for (var ii = tmpFrame.events.length - 1; ii >= 0; ii--) {
                var ev = tmpFrame.events[ii];
                if (ev instanceof PhotoEvent) {                    
                    var $div = $("<div>", {id: ev.index,  class: "photo-timeline-event"});
                    $div.attr('index',i);
                    $div.css('left',  offsetPx +'px');
                    $div.css('height',  Math.max(50,Math.min(ev.distance,100)) +'%');
                    $div.css('bottom','0px');
                    $div.ev = ev;   
                    that.div.append($div);   
                    /*BIND CLICK EVENT ON THE TIMELINE*/
                    $div.click(function(event){
                        var offset = event.clientX;
                        var perc = (offset * 100 / that.div.width()).toFixed(2);
                        var frame = that.getFrameAtPerc(perc);
                        self.bus.publish('EVENT.GUI.NAVIGATETO.FRAME',{
                            timeline: that,
                            perc : perc,
                            offset: offset,
                            frame: frame,
                            index: frame.index});
                    });                 
                };
            };
        };
                 
    });

    /*RENDER PATH ON KML REFRESH*/
    this.subscribe(self,'EVENT.STORY.REFRESH.KML',function(params){
        var events = params.events;
        for (var i = 0; i < events.length; i++) {
            var ev = events[i];            
            self.sgui.poly.getPath().push(new google.maps.LatLng(ev.position.lat(), ev.position.lng()));
        }
    });
    /*RENDER TIMELINE ON KML REFRESH*/
    this.subscribe(self,'EVENT.STORY.REFRESH.KML',function(params){       
        var events = params.events;
        var that = self.sgui.kmlTimeline;
        /*CLEAR*/
        if (params.clear)
            that.clearEvents();
        that.addEvents(events); //add the events to the timeline object

        
        /*RENDER GPS EVENTS JUST ADDED - to be moved inside the timeline code*/
        var leftoff = 0;
        var rightoff = 0;
        for (var i = that.frames.length - 1; i >= 0; i--) {
            var tmpFrame = that.frames[i];
            var width = that.div.width() - leftoff - rightoff;
            var height = that.div.height();
            var offset = i/that.frames.length;
            var offsetPx = Math.floor(offset * width) + leftoff;
            for (var ii = tmpFrame.events.length - 1; ii >= 0; ii--) {
                var ev = tmpFrame.events[ii];
                if (ev instanceof GpsEvent) {                    
                    var $div = $("<div>", {id: ev.index,  class: "kml-timeline-event"});
                    $div.attr('index',i);
                    $div.css('left',  offsetPx +'px');
                    $div.css('height',  Math.max(50,Math.min(ev.distance,100)) +'%');
                    $div.css('bottom','0px');
                    if (!ev.isReal){
                        $div.addClass('not-real');
                    }
                    $div.ev = ev;   
                    that.div.append($div);                    
                };
            };
        };

        /*BIND CLICK EVENT ON THE TIMELINE*/
        that.div.click(function(event){
            var offset = event.clientX;
            var perc = (offset * 100 / that.div.width()).toFixed(2);
            var frame = that.getFrameAtPerc(perc);
            self.bus.publish('EVENT.GUI.TIMELINE.CLICK',{
                timeline: that,
                perc : perc,
                offset: offset,
                frame: frame});
        });

        self.sgui.dateTimeline.goTo(0);

    });
    
    this.subscribe(self,'EVENT.STORY.REFRESH.DATE',function(params){ //this event is 
        //self.sgui.kmlTimeline.initialize();
        self.sgui.initializeTimelines();
    });   
    this.subscribe(self,'EVENT.GUI.NAVIGATETO.FRAME',function(params){
        var index = params.index;
        var frame = self.sgui.kmlTimeline.getFrameAtIndex(index);
        if (frame.events && frame.events.length>=1){
            var ev = frame.events[0];
            if (ev instanceof GpsEvent) {
                self.sgui.map.setCenter( new google.maps.LatLng(ev.position.lat(), ev.position.lng()));
                self.sgui.marker.setPosition(self.sgui.map.getCenter());
            }
        }
    }); 

    this.subscribe(self,'EVENT.GUI.NAVIGATETO.FRAME',function(params){
        var index = params.index;
        var frame = self.sgui.dateTimeline.getFrameAtIndex(index);
        self.sgui.dateTimeline.setDate(frame.time);
    });

    /*BIND KEYBOARD*/    
    $(document).keydown(function(e) {
        switch (e.which) {
            case 32: 
                return;
            case 37: //left
                self.sgui.prevFrame();
                return;
            case 39: //right
                self.sgui.nextFrame();
                return;
            default:
                return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
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



