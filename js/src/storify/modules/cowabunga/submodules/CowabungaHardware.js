var SModule = require('./../../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../../Smartresize.js');
var helper = require('../../../Helper.js')();
var EventType = require('../../../EventType.js');
module.exports = CowabungaHardware;


function CowabungaHardware(parent, opts) {
    if (!(this instanceof CowabungaHardware)) return new CowabungaHardware(parent, opts);
    this.opts = helper.extend({
        name: 'CowabungaHardware',
        id: 'CowabungaHardware'
    }, opts);
    /*CALL SUPERCLASS*/
    this.parent = parent;
    this.producer = this.opts.producer || this.parent;
    this.settings =  this.opts.settings || {};
    this.settings.renderer =  this.settings.renderer || {};
    this.settings.camera =  this.settings.camera || {};
    this.settings.camera.maxZoom = 50 || this.settings.camera.maxZoom;
    this.settings.camera.minZoom = 5 || this.settings.camera.minZoom;

    SModule.call(this, this.opts);
    return this;
}

inherits(CowabungaHardware, SModule);

CowabungaHardware.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('CowabungaHardware started');

    var projector = new THREE.Projector;
    var renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    //RENDERER
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.setClearColorHex(0xaaaaaa);
    self.parent.handler.prepend(renderer.domElement);

    //STATS
    var render_stats = new Stats();//TODO:MOVE TO CSS
    render_stats.domElement.style.position = 'absolute';
    render_stats.domElement.style.top = '1px';
    render_stats.domElement.style.right = '1px';
    render_stats.domElement.style.zIndex = 100;
    self.parent.handler.append(render_stats.domElement);

    var camera = new THREE.PerspectiveCamera(
			35,
			window.innerWidth / window.innerHeight,
			1,
			1000
		);
	self.parent.scene.add( camera );

    self.projector = projector;
    self.renderer = self.parent.renderer = renderer;
    self.camera = self.parent.camera = camera;
    self.stats = render_stats;
    self.bindToProducer(
        function(framecount) {
            self.stats.update();
        }, self.producer );

    $(window).smartresize(function onWindowResize() {
        self.parent.handler.width(window.innerWidth);
        self.parent.handler.height(window.innerHeight);
        var w = self.parent.handler.width();
        var h = self.parent.handler.height();

        self.camera.aspect = w / h;
        self.camera.updateProjectionMatrix();

        self.renderer.setSize(w, h);

    });
};

var zoomFactor = 1.2;
CowabungaHardware.prototype.zoomIn = function() {
    this.camera.fov *= zoomFactor;
    this.camera.fov = Math.min(this.settings.camera.maxZoom,this.camera.fov);
    this.camera.updateProjectionMatrix();
    //console.info(this.camera.fov);
};
CowabungaHardware.prototype.zoomOut = function() {
    this.camera.fov /= zoomFactor;
    this.camera.fov = Math.max(this.settings.camera.minZoom,this.camera.fov);
    this.camera.updateProjectionMatrix();
    //console.info(this.camera.fov);
};