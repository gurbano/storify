var SModule = require('./../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../Smartresize.js');
var helper = require('../../Helper.js')();
var EventType = require('../../EventType.js');

/*SUBMODULES*/
var CowabungaPhysics = require('./submodules/CowabungaPhysics.js');
var CowabungaHardware = require('./submodules/CowabungaHardware.js');
var CowabungaWorld = require('./submodules/CowabungaWorld.js');
var CowabungaCarInput = require('./submodules/CowabungaCarInput.js');
var CowabungaMouseHandler = require('./submodules/CowabungaMouseHandler.js');
var CowabungaMulti = require('./submodules/CowabungaMulti.js');
var CowabungaSceneUpdater = require('./submodules/CowabungaSceneUpdater.js');


module.exports = CowabungaMainModule;


function CowabungaMainModule(handler, opts) {
    if (!(this instanceof CowabungaMainModule)) return new CowabungaMainModule(opts);
    this.opts = helper.extend({
        name: 'CowabungaMainModule',
        id: 'CowabungaMainModule'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
    //DEFAULT
    this.handler = $(handler);
    this.opts.physics = this.opts.physics || false;
    this.opts.multiplayer = this.opts.multiplayer || false;
    this.submodules = this.opts.submodules || [];
    this.opts.debug = this.opts.debug || false;
    this.debugSubmodules = this.opts.debugSubmodules || [];
    return this;
}

inherits(CowabungaMainModule, SModule);



CowabungaMainModule.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    this.started = false;
    GLOBALS.pb.set(0);
    async.series({
        //Init physics engine, create scene
        initPhysi: function(callback) {
            GLOBALS.pb.set(10);
            self.phy = new CowabungaPhysics(
                self, //parent
                {
                    gravity: new THREE.Vector3(0, -60, 0),
                    enabled: true,
                    producer: self
                });
            self.submodules.push(self.phy);
            callback(null, self.phy);
        },
        initHardware: function(callback) { //Camera, renderer
            GLOBALS.pb.set(20);
            self.hw = new CowabungaHardware(self, {
                enabled: true,
                producer: self,
                settings: {
                    camera: {
                        maxZoom: 40,
                        minZoom: 10
                    },
                    renderer: {}
                }
            });
            self.submodules.push(self.hw);
            callback(null, self.hw);
        },
        initInput: function(callback) { //create the input handler
            GLOBALS.pb.set(30);
            self.carinput = new CowabungaCarInput({
                enabled: true
            });
            self.submodules.push(self.carinput);
            self.mousehandler = new CowabungaMouseHandler(self.handler, {
                enabled: true
            });
            self.submodules.push(self.mousehandler);
            //BIND THE CAMERA TO MOUSE PRODUCER
            self.bindToProducer(
                function(meta) {
                    var event = meta.event;
                    if (event.type === 'mousewheel') {
                        if (!event.up) {
                            self.hw.zoomIn();
                        }
                        if (event.up) {
                            self.hw.zoomOut();
                        }
                    }
                }, self.mousehandler);
            callback(null, true);
        },
        initWorld: function(callback) { // add terrain, car
            GLOBALS.pb.set(40);
            self.world = new CowabungaWorld(self, {
                enabled: true,
                producer: self,
                carInput: self.carinput
            });
            self.submodules.push(self.world);
            callback(null, self.world);
        },
        initMulti: function(callback) {
            GLOBALS.pb.set(50);
            self.garageIO = new CowabungaMulti(self, {
                enabled: true,
                producer: self
            });
            self.submodules.push(self.garageIO);
            callback(null, true);
        },
        initSceneUpdater: function(callback) {
            GLOBALS.pb.set(60);
            self.sceneUpdater = new CowabungaSceneUpdater(self, {
                enabled: true,
                producer: self, //linked to the frame producer
                target: self.scene
            }).addProducer(self.garageIO);
            self.submodules.push(self.sceneUpdater);
            callback(null, true);
        },
        /*START ALL THE MODULES*/
        initSubModules: function(callback) {
            GLOBALS.pb.set(70);
            for (var i = 0; i < self.submodules.length; i++) {
                self.submodules[i].start();
            };

            callback(null, true);
        },
        initDebugSubModules: function(callback) {
            GLOBALS.pb.set(80);
            callback(null, self.opts.debug);
        },
    }, function(err, results) {
        self.started = true;

        self.bindToProducer(
            function(framecount) {
                /*UPDATE Player POSITION*/
                //car position is updated in CowabungaCar.js -- line 70
                //UPDATE CAMERA POSITION
                if (self.vehicle && self.camera && self.vehicle.mesh.position) {
                    self.camera.position.copy(self.vehicle.mesh.position).add(new THREE.Vector3(100, 80, 100));
                    self.camera.lookAt(self.vehicle.mesh.position);

                    //UPDATE LIGHT POSITION
                    self.lights.target.position.copy(self.vehicle.mesh.position);
                    self.lights.position.addVectors(self.lights.target.position, new THREE.Vector3(20, 20, -15));


                    /*FAKE ENEMY*/
                    var position = new THREE.Vector3(0,0,0);
                    GarageServerIO.sendServerEvent({
                        type: 'updateposition',
                        id: 'camera',
                        state: {
                            position: position.copy(self.vehicle.mesh.position).add(new THREE.Vector3(4, 4, 4)),
                            rotation: self.camera.rotation
                        }
                    });
                }
                self.renderer.render(self.scene, self.camera);


            }, self);

        console.info('CowabungaMainModule started', results, self);
        GLOBALS.pb.set(100);
    });
};



CowabungaMainModule.prototype.produce = function(frame) {
    var self = this; //things are gonna get nasty
    if (!this.enabled || !this.started) {
        return;
    }
    self.consumers = self.consumers || [];
    for (var i = 0; i < this.consumers.length; i++) {
        this.consumers[i].consume({
            framecount: frame
        });
    };
};

//binded to a frameproducer
CowabungaMainModule.prototype.consume = function(frame) {
    this.produce();
};
