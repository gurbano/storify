var SModule = require('./../../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../../Smartresize.js');
var helper = require('../../../Helper.js')();
var EventType = require('../../../EventType.js');

module.exports = CowabungaPhysics;


function CowabungaPhysics(parent, opts) {
    if (!(this instanceof CowabungaPhysics)) return new CowabungaPhysics(parent, opts);
    this.opts = helper.extend({
        name: 'CowabungaPhysics',
        id: 'CowabungaPhysics'
    }, opts);
    /*CALL SUPERCLASS*/
    this.parent = parent;
    this.producer = this.opts.producer || this.parent;
    

    SModule.call(this, this.opts);    
    Physijs.scripts.worker = '/libs/physijs_worker.js';
    Physijs.scripts.ammo = '/libs/ammo.js';


    return this;
}
inherits(CowabungaPhysics, SModule);

CowabungaPhysics.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('CowabungaPhysics Starting');
    var physics_stats = new Stats(); //TODO:MOVE TO CSS
    physics_stats.domElement.style.position = 'absolute';
    physics_stats.domElement.style.top = '50px';
    physics_stats.domElement.style.right = '1px';
    physics_stats.domElement.style.zIndex = 100;
    self.parent.handler.append(physics_stats.domElement);
    self.stats = physics_stats;


    //Create the scene
    var scene = new Physijs.Scene;
    scene.setGravity(this.opts.gravity || new THREE.Vector3(0, -30, 0));




    self.scene = self.parent.scene = scene;
    self.bindToProducer(
        function(framecount) {
            self.stats.update();
            scene.simulate(undefined, 2);
        }, self.parent);
};

