var SModule = require('./../../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../../Smartresize.js');
var helper = require('../../../Helper.js')();
var EventType = require('../../../EventType.js');

module.exports = CowabungaCarInput;


function CowabungaCarInput(opts) {
    if (!(this instanceof CowabungaCarInput)) return new CowabungaCarInput(opts);
    this.opts = helper.extend({
        name: 'CowabungaCarInput',
        id: 'CowabungaCarInput'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
    this.input = {
        power: null,
        direction: null,
        steering: 0
    };
    return this;
}

inherits(CowabungaCarInput, SModule);

CowabungaCarInput.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('CowabungaCarInput started');
    document.addEventListener('keydown', function(ev) {
        switch (ev.keyCode) {
            case 37: // left
                self.input.direction = 1;
                break;

            case 38: // forward
                self.input.power = true;
                break;

            case 39: // right
                self.input.direction = -1;
                break;

            case 40: // back
                self.input.power = false;
                break;
        }
        self.produce();
    });
    document.addEventListener('keyup', function(ev) {
        switch (ev.keyCode) {
            case 37: // left
                self.input.direction = null;
                break;

            case 38: // forward
                self.input.power = null;
                break;

            case 39: // right
                self.input.direction = null;
                break;

            case 40: // back
                self.input.power = null;
                break;
        }
        self.produce();
    });

};
CowabungaCarInput.prototype.produce = function() {
    var self = this; //things are gonna get nasty
     if (!this.enabled || !this.started) {
        return;
    }
    self.consumers = self.consumers || [];
    for (var i = 0; i < this.consumers.length; i++) {
        this.consumers[i].consume({
            input: this.input
        });
    };
};
