var SModule = require('./../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../Smartresize.js');
var helper = require('../../Helper.js')();
var EventType = require('../../EventType.js');

module.exports = FacebookSourcesModule;


function FacebookSourcesModule(opts) {
    if (!(this instanceof FacebookSourcesModule)) return new FacebookSourcesModule(opts);
    opts = helper.extend({
        name: 'FB Source Digger',
        id: 'FacebookSourcesModule'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, opts);
    this.story = opts.story;
    return this;
}

inherits(FacebookSourcesModule, SModule);

FacebookSourcesModule.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('FacebookSourcesModule started');
}

FacebookSourcesModule.prototype.search = function(first_argument) {
    console.info('searching events from ' + helper.msToString(this.story.timeline.start) + ' to ' + helper.msToString(this.story.timeline.end));

    var searchFunction = function(path) {
    	var limit = 5;
        hello("facebook").api(path, {
            limit: 100
        }).on('success', function callback(resp) {
        	if (0 == limit-- )return;
            if (resp.paging && resp.paging.next) {
            	//console.info("Found " + resp.data.length + ". events. Keep going.",resp.data);
            	for (var i = 0; i < resp.data.length; i++) {
            		var obj = resp.data[i];
            		console.info(obj.story, helper.dateToString(new Date(obj.created_time)));
            	};
            	searchFunction(resp.paging.next);                
            } else {
                console.info("Found " + resp.data.length + ".",resp.data);
            }
        }).on('error', function() {
            console.error("Whoops!");
        });
    }
    searchFunction("/me/share");


};
