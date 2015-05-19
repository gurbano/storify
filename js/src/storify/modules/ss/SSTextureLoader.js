var SModule = require('./../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../Smartresize.js');
var helper = require('../../Helper.js')();
var EventType = require('../../EventType.js');

module.exports = SSTextureLoader;


function SSTextureLoader(textures,opts) {
    if (!(this instanceof SSTextureLoader)) return new SSTextureLoader(textures,opts);
    this.opts = helper.extend({
        name: 'SSTextureLoader',
        id: 'SSTextureLoader'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
    this.textures = textures || [];
    return this;
}

inherits(SSTextureLoader, SModule);

SSTextureLoader.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('SSTextureLoader started, loading ' + self.textures.length + ' textures');
    for (var i = self.textures.length - 1; i >= 0; i--) {
    	self.textures[i].texture = THREE.ImageUtils.loadTexture(self.textures[i].url);
    };
};
SSTextureLoader.prototype.get = function(alias) {
    var self = this;
	for (var i = self.textures.length - 1; i >= 0; i--) {
		if(self.textures[i].id===alias)
    	return self.textures[i].texture;
    };
    return null;
};
SSTextureLoader.prototype.produce = function() {
	var self = this; //things are gonna get nasty
   self.consumers = self.consumers || [];
    for (var i = 0; i < this.consumers.length; i++) {
        this.consumers[i].consume({framecount:this.framecount});
    };
};