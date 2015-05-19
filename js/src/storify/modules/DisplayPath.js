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
