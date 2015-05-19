var SModule = require('./../../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../../Smartresize.js');
var helper = require('../../../Helper.js')();
var EventType = require('../../../EventType.js');

module.exports = CowabungaWorld;


function CowabungaWorld(parent, opts) {
    if (!(this instanceof CowabungaWorld)) return new CowabungaWorld(parent, opts);
    this.opts = helper.extend({
        name: 'CowabungaWorld',
        id: 'CowabungaWorld'
    }, opts);
    /*CALL SUPERCLASS*/
    this.parent = parent;
    this.producer = this.opts.producer || this.parent;
    SModule.call(this, this.opts);

    return this;
}
inherits(CowabungaWorld, SModule);

CowabungaWorld.prototype.postInit = function() {
    var self = this;
    console.info('CowabungaWorld Starting');
    self.started = false;


    self.parent.scene.fog = new THREE.FogExp2(0xefd1b5, 0.0025);
    async.parallel({
        //addLights
        addLights: function(callback) {
            self.parent.lights = self.lights = self.addLights();
            callback(null, self.lights);
        },
        addGround: function(callback) {
            self.parent.ground = self.ground = self.addGround();
            callback(null, self.ground);
        },
        addCar: function(callback) {
            self.parent.vehicle = self.vehicle = self.addVehicle(function() {
                callback(null, self.car);
            });
        },
    }, function(err, results) {
        self.started = true;
        console.info('CowabungaWorld started', results, self);
    });


    self.bindToProducer(
        function(framecount) {


        }, self.producer);

};


CowabungaWorld.prototype.addLights = function() {
    var light = new THREE.DirectionalLight(0xFFFFFF);
    light.position.set(20, 20, -15);
    light.target.position.copy(this.parent.scene.position);
    light.castShadow = true;
    light.shadowCameraLeft = -150;
    light.shadowCameraTop = -150;
    light.shadowCameraRight = 150;
    light.shadowCameraBottom = 150;
    light.shadowCameraNear = 20;
    light.shadowCameraFar = 400;
    light.shadowBias = -.0001
    light.shadowMapWidth = light.shadowMapHeight = 2048;
    light.shadowDarkness = .7;
    this.parent.scene.add(light);
    return light;
};

CowabungaWorld.prototype.addGround = function() {
    //Create Material
    var ground_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('/assets/images/cowabunga/ground.jpg')
        }),
        0.8, // high friction
        0.1 // low restitution
    );
    ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
    ground_material.map.repeat.set(10, 10);

    var NoiseGen = new SimplexNoise;
    var ground_geometry = new THREE.PlaneGeometry(3000, 3000, 100, 100);
    ground_geometry.computeFaceNormals();
    ground_geometry.computeVertexNormals();

    var ground = new Physijs.HeightfieldMesh(
        ground_geometry,
        ground_material,
        0 // mass
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;

    this.parent.scene.add(ground);

    return ground;
};

var CowabungaCar = require('./CowabungaCar.js');
CowabungaWorld.prototype.addVehicle = function(callback) {
    var self = this;
    var car = new CowabungaCar(this.parent, {input: this.opts.carInput});
    car.asyncStart(function(vehicle) {
        car.start();
        self.parent.vehicle = self.vehicle = vehicle;
        callback();
    })
};
