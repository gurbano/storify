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



