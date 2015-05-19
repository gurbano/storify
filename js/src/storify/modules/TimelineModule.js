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
