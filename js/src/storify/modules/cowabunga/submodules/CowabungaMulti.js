var SModule = require('./../../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../../Smartresize.js');
var helper = require('../../../Helper.js')();
var EventType = require('../../../EventType.js');

module.exports = CowabungaMulti;


function CowabungaMulti(parent, opts) {
    if (!(this instanceof CowabungaMulti)) return new CowabungaMulti(parent, opts);
    this.opts = helper.extend({
        name: 'CowabungaMulti',
        id: 'CowabungaMulti'
    }, opts);
    /*CALL SUPERCLASS*/
    this.parent = parent;
    this.producer = this.opts.producer || this.parent;
    SModule.call(this, this.opts);

    return this;
}
inherits(CowabungaMulti, SModule);

CowabungaMulti.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    self.ready = false;
    var host = window.location.protocol + '//' + window.location.host;
    console.info('CowabungaMulti Starting', host);
    GarageServerIO.initializeGarageServer(host, {
        onReady: function(data) {
            console.info('onReady', data);
            return;
        },
        onPlayerConnect: function(data) {
            console.info('onPlayerConnect', data);
            self.ready = true;
            return;
        },
        onPlayerDisconnect: function(data) {
            console.info('onPlayerDisconnect', data);
            self.ready = false;
            return;
        },
        onPlayerUpdate: function(state) {
            return;
        },
        onEntityUpdate: function(data) {
            //console.info('onEntityUpdate', data);
            return;
        },
        onUpdatePlayerPrediction: function(state, inputs, deltaTime) {
            //console.info('onUpdatePlayerPrediction', state, inputs, deltaTime);
            if (self.parent.vehicle) {
                state.x = self.parent.vehicle.mesh.position.x;
                state.y = self.parent.vehicle.mesh.position.y;
                state.z = self.parent.vehicle.mesh.position.z;
            }
            return state;
        },
        onInterpolation: function(previousState, targetState, amount) {
            //console.info('onInterpolation');
            return targetState;
        },
        onWorldState: function(state) {
            console.info('onWorldState');
            return;
        }
    });

    //EACH FRAME
    self.bindToProducer(
        function(framecount) {
            if (self.ready && self.parent.vehicle) {
                GarageServerIO.sendServerEvent({
                    type: 'updateposition',
                    id: GarageServerIO.getId(),
                    state: {
                        position: self.parent.vehicle.mesh.position,
                        rotation: self.parent.vehicle.mesh.rotation
                    }
                });
                var playerStates = GarageServerIO.getPlayerStates();
                for (var i = 0; i < playerStates.length; i++) {
                    var s = playerStates[i];
                    if (s.id !== GarageServerIO.getId()){
                        self.produce(s);
                    }
                };
                var entityStates = GarageServerIO.getEntityStates();
            }
        }, self.producer);

    //EACH TIME CAR INPUT IS PRODUCED
    self.bindToProducer(
        function(data) {
            //console.info('input update',data);
            if (self.ready) {
                GarageServerIO.addInput(data.input);
            }
        }, self.parent.carinput);
};


CowabungaMulti.prototype.produce = function(s) {
    var self = this; 
    self.consumers = self.consumers || [];
    for (var i = 0; i < this.consumers.length; i++) {
        this.consumers[i].consume({state:s});
    };
};