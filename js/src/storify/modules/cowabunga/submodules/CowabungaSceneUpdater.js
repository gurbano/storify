var SModule = require('./../../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../../Smartresize.js');
var helper = require('../../../Helper.js')();
var EventType = require('../../../EventType.js');

module.exports = CowabungaSceneUpdater;

/**
 * Works as an adapter between
 * @param {[type]} parent [description]
 * @param {[type]} opts   [description]
 */
function CowabungaSceneUpdater(parent, opts) {
    if (!(this instanceof CowabungaSceneUpdater)) return new CowabungaSceneUpdater(parent, opts);
    this.opts = helper.extend({
        name: 'CowabungaSceneUpdater',
        id: 'CowabungaSceneUpdater'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
    this.parent = parent;
    this.carMap = {};
    return this;
}

inherits(CowabungaSceneUpdater, SModule);

CowabungaSceneUpdater.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('CowabungaSceneUpdater started');
};


CowabungaSceneUpdater.prototype.consume = function(data) {
    var self = this; //things are gonna get nasty
    //console.info(data);
    if (data.state && data.state.id) {
        var id = data.state.id;
        if (!this.carMap[id]) {
            self.carMap[id] = id;
            console.info('adding car ' + id);
            self.addVehicle(data.state.state, function(car) {
                self.carMap[id] = car;
                self.parent.scene.add(car);
            });
        } else {
            var car = this.carMap[id];
            if (car.geometry && data.state.state.position && data.state.state.rotation) {
                //console.debug('updating car ' + id);
                car.position.set(data.state.state.position.x, data.state.state.position.y, data.state.state.position.z)
                car.rotation.set(data.state.state.rotation.x, data.state.state.rotation.y, data.state.state.rotation.z);
            }
        }
    }
};


var CowabungaEnemyCar = require('./CowabungaEnemyCar.js');
CowabungaSceneUpdater.prototype.addVehicle = function(data, callback) {
    var self = this;
    var car = new CowabungaEnemyCar(this.parent);
    car.asyncStart(function(vehicle) {
        car.start();
        callback(vehicle);
    })
};
