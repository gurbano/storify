  var helper = require('../../Helper.js')();
  var CameraPostProcessor = require('../CameraPostProcessor.js');
  var inherits = require('inherits');
  module.exports = EarthModuleCameraPostProcessor;


  function EarthModuleCameraPostProcessor(parent, scene, camera, renderer, opts) {
      if (!(this instanceof EarthModuleCameraPostProcessor)) return new EarthModuleCameraPostProcessor(parent, scene, camera, renderer, opts);
      opts = helper.extend({
          name: 'EarthModuleCameraPostProcessor',
          id: 'EarthModuleCameraPostProcessor'
      }, opts);
      CameraPostProcessor.call(this, scene, camera, renderer, opts);
      this.opts = opts;

      return this;
  }

  inherits(EarthModuleCameraPostProcessor, CameraPostProcessor);


  EarthModuleCameraPostProcessor.prototype.postInit = function() {

      var renderModel = new THREE.RenderPass(this.scene, this.camera);
      var effectBloom = new THREE.BloomPass(1.25);
      var effectFilm = new THREE.FilmPass(0.35, 0.95, 2048, false);
      effectFilm.renderToScreen = true;

      this.composer = new THREE.EffectComposer(this.renderer);

      this.composer.addPass(renderModel);
      this.composer.addPass(effectBloom);
      this.composer.addPass(effectFilm);

  };
