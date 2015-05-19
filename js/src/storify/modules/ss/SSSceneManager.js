var SModule = require('./../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../Smartresize.js');
var helper = require('../../Helper.js')();
var EventType = require('../../EventType.js');

module.exports = SSSceneManager;


function SSSceneManager(parent, opts) {
    if (!(this instanceof SSSceneManager)) return new SSSceneManager(parent, opts);
    this.opts = helper.extend({
        name: 'SSSceneManager',
        id: 'SSSceneManager'
    }, opts);
    /*CALL SUPERCLASS*/
    this.parent = parent;
    SModule.call(this, this.opts);
    this.entities = {};
    return this;
}

inherits(SSSceneManager, SModule);

SSSceneManager.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('SSSceneManager started');
    self.scene = self.parent.scene = new THREE.Scene();
};


SSSceneManager.prototype.addEntity = function(entity, id, parentId) {
    if (id && this.entities[id]) {
        console.error('an entity with the same ID exists already', id, this.entities[id]);
        return;
    }
    id = id || helper.getUID();
    if (!entity.uid) {
        entity.uid = id;
    }
    this.entities[entity.uid] = entity;
    if (parentId) {
        if (!this.entities[parentId]) {
        	console.error('Trying to add to unknown parent entity', parentId);
        	return;
        	    
        }else{
        	this.entities[parentId].add(entity);
        }
    } else {
    	this.scene.add(entity);
        
    }
};
