var SModule = require('./../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../Smartresize.js');
var helper = require('../../Helper.js')();
var EventType = require('../../EventType.js');

module.exports = SSControls;


function SSControls(camera, scene, opts) {
    if (!(this instanceof SSControls)) return new SSControls(camera, scene, opts);
    this.opts = helper.extend({
        name: 'SSControls',
        id: 'SSControls'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
    this.camera = camera;
    this.scene = scene;
    $(document.body).prepend('<div id="blocker"><div id="instructions"><span style="font-size:40px">Click to play</span><br />(W, A, S, D = Move, SPACE = Jump, MOUSE = Look around)</div></div>');

    return this;
};

inherits(SSControls, SModule);

require('./SSCameraControl.js');
require('./THREE.FlyControls.js');

SSControls.prototype.start = function() {
    var self = this; //things are gonna get nasty
    this.blocker = document.getElementById('blocker');
    this.instructions = document.getElementById('instructions');
    document.body.addEventListener('click', function(event) {
        self.requestPointerLock();
    });
    /*GET POINTLOCKER*/
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    if (havePointerLock) {
        document.addEventListener('pointerlockchange', function() {
            self.pointerlockchange(self)
        }, false);
        document.addEventListener('mozpointerlockchange', function() {
            self.pointerlockchange(self)
        }, false);
        document.addEventListener('webkitpointerlockchange', function() {
            self.pointerlockchange(self)
        }, false);
        document.addEventListener('pointerlockerror', self.pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', self.pointerlockerror, false);
        document.addEventListener('webkitpointerlockerror', self.pointerlockerror, false);
    }
    //CREATE CONTROLS
    return this.postInit();

};

SSControls.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('SSControls started');
    self.camera.position.set(0, 0, 500);
    self.controls = new THREE.SSCameraControl(self.camera);
    self.scene.add(self.controls.getObject());


    self.controls.enabled = false;

    return self.controls;
};

SSControls.prototype.requestPointerLock = function() {
    var element = document.body;
    instructions.style.display = 'none';
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    if (/Firefox/i.test(navigator.userAgent)) {
        document.addEventListener('fullscreenchange', function() {
            self.fullscreenchange(self)
        }, false);
        document.addEventListener('mozfullscreenchange', function() {
            self.fullscreenchange(self)
        }, false);
        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
        element.requestFullscreen();
    } else {
        element.requestPointerLock();
    }
}

SSControls.prototype.pointerlockchange = function(self) {
    var element = document.body;
    if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
        self.controls.enabled = true;
        self.blocker.style.display = 'none';
    } else {
        self.controls.enabled = false;
        self.blocker.style.display = '-webkit-box';
        self.blocker.style.display = '-moz-box';
        self.blocker.style.display = 'box';
        self.instructions.style.display = '';
    }
};

SSControls.prototype.pointerlockerror = function(error) {
    console.error('pointerlockerror', error);
};

SSControls.prototype.fullscreenchange = function(self) {
    var element = document.body;
    if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
        document.removeEventListener('fullscreenchange', self.fullscreenchange);
        document.removeEventListener('mozfullscreenchange', self.fullscreenchange);
        element.requestPointerLock();
    }
};
