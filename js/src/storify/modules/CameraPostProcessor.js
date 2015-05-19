  var helper = require('./../Helper.js')();
  var SModule = require('./SModule.js');
  var inherits = require('inherits');
  module.exports = CameraPostProcessor;

  function CameraPostProcessor(scene, camera, renderer, opts) {
      if (!(this instanceof CameraPostProcessor)) return new CameraPostProcessor(scene, camera, renderer, opts);
      opts = helper.extend({
          name: 'CameraPostProcessor',
          id: 'CameraPostProcessor'
      }, opts);
      SModule.call(this, opts);
      this.scene = scene;
      this.camera = camera;
      this.renderer = renderer;

      this.opts = opts;
      this.composer = undefined;
      return this;
  }

  inherits(CameraPostProcessor, SModule);

  CameraPostProcessor.prototype.render = function(a) {
      if (this.composer)
          this.composer.render(a);
  };
