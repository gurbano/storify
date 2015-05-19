var helper = require('../../Helper.js')();

module.exports = EarthModuleSceneManager;

function EarthModuleSceneManager(parent, opts) {
    if (!(this instanceof EarthModuleSceneManager)) return new EarthModuleSceneManager(parent, opts);
    opts = helper.extend({
        name: 'EarthModuleSceneManager',
        id: 'EarthModuleSceneManager'
    }, opts);

    this.parent = parent;
    return this;
}

/**
 * init
 * 		this.renderer
 * 		this.camera
 * 		this.controls
 * @return {[type]} [description]
 */
EarthModuleSceneManager.prototype.start = function() {
    var self = this; //things are gonna get nasty
    var parent = self.parent;
    var hw = parent.hw;
    console.info('Scene manager started');

     // create a basic scene and add the camera
     self.scene = new THREE.Scene();
     self.scene.collision = [];
     self.scene.add(hw.camera);
     self.bindResize(hw.renderer, hw.camera, hw.controls);
    return self;
};

EarthModuleSceneManager.prototype.bindResize = function(renderer, camera, controls) {
     // var callback = function() {
     //     renderer.setSize(window.innerWidth, window.innerHeight);
     //     camera.aspect = window.innerWidth / window.innerHeight;
     //     camera.updateProjectionMatrix();
     //     controls.handleResize();

     // };
     // window.addEventListener('resize', callback, false);
     // return {
     //     /**
     //      * Stop watching window resize
     //      */
     //     stop: function() {
     //         window.removeEventListener('resize', callback);
     //     }
     // };
 };