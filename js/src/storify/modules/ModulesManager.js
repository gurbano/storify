var SModule = require('./SModule.js');
var inherits = require('inherits');
var smartresize = require('../Smartresize.js');
var helper = require('../Helper.js')();
var EventType = require('../EventType.js');

module.exports = ModulesManager;


function ModulesManager(opts) {
    if (!(this instanceof ModulesManager)) return new ModulesManager(opts);
    opts = helper.extend({
        name: 'ModulesManager',
        id: 'ModulesManager'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, opts);
    this.parent = opts.parent; // where the UI will be displayed 
    this.opts = opts;
    return this;
}

inherits(ModulesManager, SModule);

ModulesManager.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('ModulesManager started');
    var self = this; //things are gonna get nasty
    //this.win -- this.win.$title -- this.win.$content
    this.win = this.createModalWindow(
        'ModulesManager', // Title
        { //options
            content: '', //html to be displayed
            resizable: false,
            modal: true,
            width: 200,
            height: 150
        },
        this.parent); //parent div

    var html = '<p style="font-size:0.8em">List of modules installed</p>';
    this.win.$content.html(html);
    /*BUILD THE UI*/
    this.checks = [];
    var ul = $('<ul style="list-style-type:none"></ul>');
    for (var i = 0; i < this.consumers.length; i++) {
        var module = this.consumers[i];
        var li = $("<li>" + module.name + "</li>");
        this.checks[i] = $('<input type="checkbox"></input>');
        this.checks[i].prop('val', i);
        li.prepend(this.checks[i]);
        this.checks[i].prop('checked', module.enabled);
        this.checks[i].click(function(el) {
            var index = $(el.target).prop('val');
            var module = self.consumers[index];
            module.toggle(self.checks[index].is(':checked'));
        });
        ul.append(li);
    };
    this.win.$content.append(ul);
    this.refresh();
}
ModulesManager.prototype.refresh = function() {
    var self = this; //things are gonna get nasty    
    for (var i = 0; i < this.consumers.length; i++) {
        var module = this.consumers[i];
        this.checks[i].prop('checked', module.enabled);
    }
    setTimeout(function() {
        self.refresh();
    }, 1500);
}
