var helper = require('../../Helper.js')();
var smartresize = require('../../Smartresize.js');

module.exports = EarthModuleHardware;

var POS_X = 0;
var POS_Y = 0;
var POS_Z = 2800;

var EARTH_SIZE = 600;

var FOV = 45;
var NEAR = 1;
var FAR = 400000 * 1000000;
var CLEAR_HEX_COLOR = 0x000000;

var CAMERA_SPEED = 0.009;

function EarthModuleHardware(parent, opts) {
    if (!(this instanceof EarthModuleHardware)) return new EarthModuleHardware(parent, opts);
    opts = helper.extend({
        name: 'EarthModuleHardware',
        id: 'EarthModuleHardware'
    }, opts);

    this.parent = parent;
    return this;
}

/**
 * init
 *  this.renderer
 *  this.camera
 *  this.controls
 * @return {[type]} [description]
 */
EarthModuleHardware.prototype.start = function() {
    var self = this; //things are gonna get nasty
    var parent = self.parent;
    var canvas = parent.canvas;
    var w = canvas.width();
    var h = canvas.height();

    /*
    RENDERER
     */
    self.renderer = new THREE.WebGLRenderer();
    self.renderer.setSize(w, h);
    self.renderer.setClearColorHex(0x000000);
    canvas.append(self.renderer.domElement);

    /*
    CAMERA
     */
    self.camera = new THREE.PerspectiveCamera(FOV, w / h, NEAR, FAR);
    self.camera.position.set(POS_X, POS_Y, POS_Z);
    self.camera.lookAt(new THREE.Vector3(0, 0, 0));


  

    /*
    CONTROLS
     */
    self.controls = new THREE.TrackballControls(self.camera, document.getElementById('UI-EDIT'));
    self.controls.rotateSpeed = 1.0;
    self.controls.zoomSpeed = 1.2;
    self.controls.panSpeed = 0.8;

    self.controls.noZoom = false;
    self.controls.noPan = false;

    self.controls.staticMoving = false;
    self.controls.dynamicDampingFactor = 0.3;

    self.controls.minDistance = EARTH_SIZE + EARTH_SIZE / 100;
    self.controls.maxDistance = 400000;

    self.controls.keys = [65, 83, 68];
    $(window).smartresize(function onWindowResize() {
        canvas.width(window.innerWidth);
        canvas.height(window.innerHeight);
        var w = canvas.width();
        var h = canvas.height();

        self.camera.aspect = w / h;
        self.camera.updateProjectionMatrix();

        self.renderer.setSize(w, h);

    });
    return self;
};


EarthModuleHardware.prototype.loadTexture = function(textures, callback, ret) {
    var self = this; //things are gonna get nasty

    ret = ret || {};
    console.info('[Loading textures: ' + textures.length + ' remaining]');
    if (textures.length === 0) {
        callback(ret);
    } else {
        var id = textures[textures.length - 1].id;
        var file = textures[textures.length - 1].file;
        THREE.ImageUtils.loadTexture(file, undefined, function(texture) {
            ret[id] = texture;
            self.loadTexture(textures.splice(0, textures.length - 1), callback, ret);
        });
    }
};
