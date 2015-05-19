var SModule = require('./SModule.js');
var inherits = require('inherits');
var smartresize = require('../Smartresize.js');
var helper = require('../Helper.js')();
var EventType = require('../EventType.js');

module.exports = SourceManager;


function SourceManager(opts) {
    if (!(this instanceof SourceManager)) return new SourceManager(opts);
    opts = helper.extend({
        name: 'SourceManager',
        id: 'SourceManager'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, opts);
    this.listeners = [];
    return this;
}

inherits(SourceManager, SModule);

SourceManager.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('SourceManager started');
    this.win = this.createModalWindow(
        'SourceManager', // Title
        { //options
            content: '', //html to be displayed
            resizable: false,
            modal: true,
            width: 400,
            height: 150
        },
        this.UIedit); //parent div
    this.refresh();
}
SourceManager.prototype.refresh = function() {
    var self = this; //things are gonna get nasty
    var html = '<p style="font-size:0.8em">List of sources modules installed</p>';
    this.win.$content.html(html);
    var ul = $('<ul style="list-style-type:none"></ul>');
    for (var i = 0; i < this.listeners.length; i++) {
        var module = this.listeners[i];
        var li = $("<li>" + module.name + "</li>");
        var check = $('<input type="checkbox"></input>');
        check.prop('val', i);
        li.prepend(check);
        check.prop('checked', module.enabled);

        check.click(function(el) {
            self.listeners[$(el.target).prop('val')].toggle(check.is(':checked'));
            setTimeout(function() {
                self.refresh();
            }, 500);
        });

        var linker = $("<div style='display:inline'><img val = '" + i + "' src='./icon/content/svg/ic_link_24px.svg'></div>");
        li.append(linker);
        linker.module = module;
        linker.click(linkFB(linker));
        ul.append(li);
    };
    this.win.$content.append(ul);

}

var linkFB = function(linker) {
    var obj = linker;
    return function(el) {        
        obj.module.search();
    }
}
