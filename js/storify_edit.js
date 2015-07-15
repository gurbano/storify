var test = require('./src/test');
var SGUI = require('./src/SGUI_EDIT');
var SStory = require('./src/SStory');
var EventBus = require('./src/EventBus');
var KMLImporterBackend = require('./src/KMLService');

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
        var _events = importer.importGoogleLocation({
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
                    sensT: 6 * 60 * 1000 // 6 min
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
        }, params, self.sgui.kmlTimeline); //timeline is needed to get infos about frame, scale etc.etc.
        self.sgui.close('kmlImporter');
        self.publish('EVENT.STORY.REFRESH.KML',{events: _events});
    });


    this.subscribe(self,'EVENT.STORY.REFRESH.PHOTO',function(params){

                 
    });

    /**/
    this.subscribe(self,'EVENT.STORY.REFRESH.KML',function(params){       
        console.info(event,params);
        var events = params.events;
        if (params.clear)
            self.sgui.kmlTimeline.clearEvents();
        self.sgui.kmlTimeline.addEvents(events);
        console.info(self.sgui.kmlTimeline);
        
        /*
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
        */
                        
    });
    this.subscribe(self,'EVENT.STORY.REFRESH.DATE',function(event,params){
        self.sgui.kmlTimeline.initialize();
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



