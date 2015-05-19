var SModule = require('./../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../Smartresize.js');
var helper = require('../../Helper.js')();
var EventType = require('../../EventType.js');

module.exports = SSMainModule;


function SSMainModule(target, opts) {
    if (!(this instanceof SSMainModule)) return new SSMainModule(opts);
    this.opts = helper.extend({
        name: 'SSMainModule',
        id: 'SSMainModule'
    }, opts);
    /*CALL SUPERCLASS*/
    this.$target = target;
    SModule.call(this, this.opts);
    return this;
}

inherits(SSMainModule, SModule);

var SSLoader = require('./SSLoader.js');
var SSTextureLoader = require('./SSTextureLoader.js');
var SSHardware = require('./SSHardware.js');
var SSSceneManager = require('./SSSceneManager.js');
var SSEntityFactory = require('./SSEntityFactory.js');
var SSPlayer = require('./SSPlayer.js');

SSMainModule.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('SSMainModule started');

    /*CREATE THE LOADER: load submodules async*/
    self.loader = new SSLoader({});
    self.bindToProducer(function(event) {
        console.info(event);
        if (event.type === 'onLoad') {

        }
        if (event.type === 'onLoadStart') {

        }
        if (event.type === 'onLoadEnd') {
            self.sm.addEntity(self.ef.createLights().moveAt(1000, 1000, 1000).lookTo(0,0,0),'LIGHT');
        	self.sm.addEntity(self.ef.createTerrain(100, 100),'TERRAIN');
            //self.sm.addEntity(self.ef.getSphere(100).moveAt(0, 0, 0),'SPHERE');
            //self.sm.addEntity(self.ef.createAxis(true, true, true),'AXIS','TERRAIN');
            //self.sm.addEntity(self.ef.createLights(true, true, true),'AXIS','TERRAIN');
        }
    }, self.loader);

    /*Create submodules and start application*/    
    self.sm = new SSSceneManager(self, {
        enabled: true
    });
    self.textureManager = new SSTextureLoader([
            {id: 'playa', url: '/assets/images/ss/terr_0.jpg' },
            {id: 'playa1', url: '/assets/images/ss/terr_1.jpg' },
        ],{});
    self.ef = new SSEntityFactory({tm : self.textureManager});
    self.hw = new SSHardware(
        self, //parent
        self.$target, //target 
        {
            enabled: true,
            producer: self,
            settings: {
                camera: {
                    maxZoom: 40,
                    minZoom: 10
                },
                renderer: {}
            }
        }
    );
    self.player = new SSPlayer(
    	self.camera, 
    	self.controls
    	,{});
    self.loader
        .addSubmodule(self.sm)
        .addSubmodule(self.hw)
        .addSubmodule(self.textureManager)
        .addSubmodule(self.player)
    .start();
};









SSMainModule.prototype.produce = function(frame) {
    var self = this; //things are gonna get nasty
    self.consumers = self.consumers || [];
    for (var i = 0; i < this.consumers.length; i++) {
        this.consumers[i].consume({
            framecount: frame
        });
    }
};


/*FRAME CONSUMER
  1 - produce (work as a proxy)
  2 - call render
  3 - update controls
*/
SSMainModule.prototype.consume = function(frame) {
    var self = this; //things are gonna get nasty
    self.produce(frame);
    if (self.renderer && self.scene && self.camera) {
        self.renderer.render(self.scene, self.camera);
    }
 
};
