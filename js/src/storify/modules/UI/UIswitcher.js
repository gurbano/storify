var SModule = require('./../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../Smartresize.js');
var helper = require('../../Helper.js')();
var EventType = require('../../EventType.js');

module.exports = UISwitcherModule;


function UISwitcherModule(opts) {
    var self = this; //things are gonna get nasty
    if (!(this instanceof UISwitcherModule)) return new UISwitcherModule(opts);
    opts = helper.extend({
        name: 'UISwitcherModule',
        id: 'UISwitcherModule'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, opts);
    this.parent = opts.parent; // where the controls will be displaye
    return this;
}

inherits(UISwitcherModule, SModule);

UISwitcherModule.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    //this.win -- this.win.$title -- this.win.$content
    this.win = this.createModalWindow(
        'Mode switcher', // Title
        { //options
            content: '<p style="font-size:0.8em">Click the button to switch between edit mode and view mode</p>', //html to be displayed
            resizable: false,
            modal: true,
            width: 200,
            height: 150,
            position: {
                top: '10px',
                left: '70%'
            }
        },
        this.parent); //parent div
    var isEditMode = self.UIedit.parent().hasClass('active');
    this.win.$content.append(($('<span>' + 'Switch to ' + '</span>')));
    this.win.$content.append(
        this.createButton(isEditMode ? 'VIEW' : 'EDIT',
            function(btn, module) {
                self.UIedit.parent().toggleClass("active");
                self.UIview.parent().toggleClass("active");
                $(btn).removeClass('red');
                $(btn).removeClass('green');
                btn.$text.html(self.UIedit.parent().hasClass('active') ? 'VIEW' : 'EDIT');
                $(btn).addClass(self.UIedit.parent().hasClass('active') ? 'green' : 'red');
            })
    );
    return this;
};

