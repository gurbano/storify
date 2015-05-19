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
