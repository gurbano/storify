var SModule = require('./../../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../../Smartresize.js');
var helper = require('../../../Helper.js')();
var EventType = require('../../../EventType.js');

module.exports = CowabungaEnemyCar;


function CowabungaEnemyCar(parent, opts) {
    if (!(this instanceof CowabungaEnemyCar)) return new CowabungaEnemyCar(parent, opts);
    this.opts = helper.extend({
        name: 'CowabungaEnemyCar',
        id: 'CowabungaEnemyCar'
    }, opts);
    /*CALL SUPERCLASS*/
    this.parent = parent;
    this.producer = this.opts.producer || this.parent;
    SModule.call(this, this.opts);

    return this;
}
inherits(CowabungaEnemyCar, SModule);

CowabungaEnemyCar.prototype.postInit = function() {
    console.info('CowabungaEnemyCar started: remember to call asyncStart(callback)');
};


CowabungaEnemyCar.prototype.asyncStart = function(callback) {
    var self = this; //things are gonna get nasty
    console.info('CowabungaEnemyCar Starting');
    var loader = new THREE.JSONLoader();
    loader.load("/assets/models/mustang.js", function(car, car_materials) {
        loader.load("/assets/models/mustang_wheel.js", function(wheel, wheel_materials) {
            var mesh = new THREE.Mesh(
                car,
                new THREE.MeshFaceMaterial(car_materials)
            );
            mesh.position.y = 2;
            mesh.castShadow = mesh.receiveShadow = true;   
            self.mesh = mesh;
            callback(mesh);
        });
    });
};


CowabungaEnemyCar.prototype.consume = function(input) {

};