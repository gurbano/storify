var Frame = require('./Frame.js');
var helper = require('./storify/Helper.js')();

module.exports = Timeline;

function Timeline(story, opts, cb) {
    var self = this;
    if (!(this instanceof Timeline)) return new Timeline(story, opts,cb);
    this.story = story;
    this.opts = opts;
    this.scale = opts.scale || 10; // delta minutes between frames
    this.frames = opts.frames || [];
    this.start = opts.start || new Date().getTime(); // ms
    this.end = opts.end || new Date().getTime(); // ms
    this.events = opts.events || [];
    if (cb){
        cb(this);
    }
    this.initialize = function() {
        self.start  = self.story.startTime;
        self.end  = self.story.endTime;
        var startMs = self.start;
        var endMs = self.end;
        var diffMs = endMs - startMs;
        var diffm = diffMs / 1000 / 60;
        var diffh = diffm / 60;
        var diffd = diffh / 24;
        self.steps = (diffm / self.scale).toFixed(0);
        for (var i = 0; i < self.steps; i++) {
            var frame = new Frame({
                index: i,
                time: startMs + (i * 1000 * 60 * self.scale),
                events: [] //cache is initialized 
            });
            self.frames.push(frame);
        }
        //console.info('Timeline initialized', this.start,this.end, ' steps: ',this.steps);
        //console.info(self);
    };        
    this.getMsStep = function() {
        return self.scale * 60 * 1000;
    };
    this.getPercAtFrame = function(_f, _precision) {
        var precision = _precision || 0;
        var frameIndex = Math.max(0, Math.min(_f, self.steps - 1));
        var offset = ((frameIndex / (self.steps - 1)) * (100)).toFixed(precision);
        return offset;
    };
    this.getFrameAtPerc = function(_p) {
        var percentage = Math.max(0, Math.min(_p, 100));
        var offset = ((percentage / 100) * (self.steps - 1)).toFixed(0);
        return self.frames[offset];
    };
    this.getPercAtTime = function(_p, _precision) {
        var precision = _precision || 0;
        var deltaTot = self.end - self.start;
        var time = _p - self.start;
        var x = ((time * 100)/deltaTot).toFixed(precision);
        return x;
    };
    this.getFrameAtTime = function(_p) {
        return self.getFrameAtPerc(self.getPercAtTime(_p));
    };
    this.extend = function(newstart, newend) {
        //console.info(self.frames, helper.shallowCopy(self.frames));
        var frameCopy = helper.shallowCopy(self.frames);
        self.start = newstart;
        self.end = newend;
        self.frames = [];
        for (var i = self.events.length - 1; i >= 0; i--) {
            if (self.events[i].subtype && self.events[i].subtype === '__auto') {
                self.events = self.events.splice(i, 1); //index, howmany
            }
        };
        self.initialize();
    };

    this.addEvents = function(events) {
        for (var i = events.length - 1; i >= 0; i--) {
            var ev = events[i];
            self.addEvent(ev);
        };    
    };


    this.addEvent = function(event) {
        self.events.push(event);
        for (var i = event.start_frame; i <= event.end_frame; i++) {
            self.frames[i].events.push(event); //cache
        };

    };
    return this;
}


