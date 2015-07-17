//SGUI
var Timeline = require('./Timeline.js');
var config = {};
config.kmlimport = require('./gui/kmlImporter.js');
config.kmltimeline = require('./gui/kmlTimeline.opt.js');
config.phototimeline = require('./gui/photoTimeline.js');
config.datetimeline = require('./gui/dateTimeline.js');


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
		self.app.bus.publish('EVENT.GUI.KMLUPLOADED',res);
	});
	myDropzone.on("complete", function(file) {

	});
	myDropzone.on("uploadprogress", function(file, progress) {

	});


	/*KML TIMELINE*/
    /*photo timeline*/
    this.photoTimeline = new Timeline(app.story, config.phototimeline, function(that){
		self.addGUI('photo-timeline-wrapper',{classes: 'VIEW-GUI', config: that.opts });
		that.div = $('#photo-timeline-wrapper > div');
	});
	/*KML TIMELINE*/
	this.kmlTimeline = new Timeline(app.story, config.kmltimeline, function(that){
		self.addGUI('kml-timeline-wrapper',{classes: 'VIEW-GUI', config: that.opts });
		that.div = $('#kml-timeline-wrapper > div');
	});
    /*Calendar timeline*/
    this.dateTimeline = new Timeline(app.story, config.datetimeline, function(that){
		self.addGUI('date-timeline-wrapper',{classes: 'VIEW-GUI', config: that.opts });
		that.div = $('#date-timeline-wrapper > div');
		that.$dragger = $($('<div class="draggable"></div>'));
    	that.div.append(that.$dragger);    
    	that.$dragger.getMaxPx = function() {
	        return (that.div.width() - that.$dragger.width());
	    };
	    that.$dragger.getPosition = function() {
	        return (100 * (that.$dragger[0].offsetLeft / that.$dragger.getMaxPx()).toFixed(10));
	    };
	    that.$dragger.setPosition = function(percentage) {
	        var offset = (percentage / 100) * that.$dragger.getMaxPx();
	        that.$dragger.css('left', offset);
	    };
	    that.$dragger.refresh = function() {
	        var index = that.current;
	        that.$dragger.setPosition(that.getPercAtFrame(that.current, 10)); //In case the frame is changed,update position
	    };
	    that.$dragger.draggable({
	        containment: "parent",
	        drag: function(event) {
	            var frame =  self.kmlTimeline.getFrameAtPerc(that.$dragger.getPosition());
	            if (frame){
	            	that.current = frame.index;
	            	self.app.bus.publish('EVENT.GUI.NAVIGATETO.KMLFRAME',{
	            		index: frame.index,
	            		frame: frame
	            	});
	            }
	        },
	        stop: function() {
	        	var frame =  self.kmlTimeline.getFrameAtPerc(that.$dragger.getPosition());
	        	if (frame){
		            that.current = frame.index;
	            }
	        }
	    });
	});
    
    
  	/*GMAP*/
  	var mapOptions = {
        center: new google.maps.LatLng(41.54, 12.30),
        disableDefaultUI: true,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(document.getElementById('map-canvas'),  mapOptions);

    this.poly = new google.maps.Polyline({
	    strokeColor: '#000000',
	    strokeOpacity: 1.0,
	    strokeWeight: 3
  	});
  	this.poly.setMap(this.map);
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