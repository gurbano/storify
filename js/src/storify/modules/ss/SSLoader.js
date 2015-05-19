var SModule = require('./../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../Smartresize.js');
var helper = require('../../Helper.js')();
var EventType = require('../../EventType.js');

module.exports = SSLoader;


function SSLoader(opts) {
	if (!(this instanceof SSLoader)) return new SSLoader(opts);
	this.opts = helper.extend({
		name: 'SSLoader',
		id: 'SSLoader'
	}, opts);
	/*CALL SUPERCLASS*/
	this.submodules = [];
	SModule.call(this, this.opts);
	return this;
}

inherits(SSLoader, SModule);

SSLoader.prototype.postInit = function() {
	var self = this; //things are gonna get nasty
	console.info('SSLoader started');
	self.produce({
		type: 'onStart'
	});
	self.load();
};

SSLoader.prototype.load = function() {
	var self = this;
	this.produce({
		type: 'onLoadStart'
	});
	for (var i = 0 ; i < this.submodules.length; i++) {
		this.submodules[i].start();
	};
	self.produce({
		type: 'onLoadEnd'
	});
};



SSLoader.prototype.produce = function(event) {
	var self = this; //things are gonna get nasty
	self.consumers = self.consumers || [];
	for (var i = 0; i < this.consumers.length; i++) {
		this.consumers[i].consume(event);
	};
};

SSLoader.prototype.addSubmodule = function(module) {
	this.submodules.push(module);
	return this;
};