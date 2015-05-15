//SGUI

var config = {};
config.kmlimport = require('./gui/kmlimporter.js');
config.timeline = require('./gui/timeline.js');


module.exports = SGUI;

function SGUI(app, opts) {
    var self = this;
    opts = opts || {};
    if (!(this instanceof SGUI)) return new SGUI(app, opts);
    this.app = app;
    this.target = $('#target');
    this.guis = {};
    /*KML IMPORTER*/
    var importerGUI = this.addGUI('kmlImporter',{classes: 'EDIT-GUI', config: config.kmlimport });
    var myDropzone = new Dropzone("#drop_target", {
       		url: "/uploadKML"
	});
	myDropzone.on("success", function(file, res) {
		self.app.bus.publish('klmuploaded',res);
	});
	myDropzone.on("complete", function(file) {

	});
	myDropzone.on("uploadprogress", function(file, progress) {

	});
	/*TIMELINE*/
	var timeline = this.addGUI('timeline-wrapper',{classes: 'VIEW-GUI', config: config.timeline });
  	this.app.bus.subscribe('STORY.REFRESH',function(event,params){
        var $tline = $('#timeline');
        var delta = self.app.story.endTime - self.app.story.startTime;
        var width = $tline.width();
        var events = self.app.story.events;
        for (var i = 0; i <= events.length - 1; i++) {
        	var offset = events[i].delta/delta;
        	var offsetPx = Math.floor(offset * width);
        	//console.info(i,offset, offsetPx);
        	var $div = $("<div>", {id: events[i].delta,  class: "timeline-event"});
        	$div.attr('index',i);
        	$div.css('left',  offsetPx +'px');
        	$div.ev = events[i];
        	$div.hover( function(){
        		var event = self.app.story.events[$(this).attr('index')];
        		//console.info(event);
        		self.map.setCenter(new google.maps.LatLng(event.where.lat, event.where.lng))
        		self.marker.setPosition(self.map.getCenter());
        	}, function(){

        	} ) 
        	$tline.append($div);
        };
                        
    });
  	/*GMAP*/
  	var mapOptions = {
        center: new google.maps.LatLng(41.54, 12.30),
        disableDefaultUI: true,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById('map-canvas'),  mapOptions);
    this.marker = new google.maps.Marker({
        position:  this.map.getCenter(),
        map: this.map
    });
    return self;
}

SGUI.prototype.printInfo = function() {
	console.info(this.app);
};


SGUI.prototype.close = function(_id) {
	if (this.guis[_id].modal){
		this.guis[_id].dialog( "close" );
	}else{
		this.guis[_id].hide();
	}
};

SGUI.prototype.addGUI = function(_id, opts) {
	var width = opts.config.width || opts.width || "200";
	var height = opts.config.height || opts.height || "200"
	var $div = $("<div>", {id: _id, class: "GUI"});
	this.target.append($div);
	this.guis[_id] = $div;
	$div.addClass(opts.classes || "gui");
	if (opts.config.modal){
		$div.modal = true;
		$div.dialog({width:width, height:height});	
	}
	$div.append($(opts.config.div));
	opts.config.init();

	return $div;
};