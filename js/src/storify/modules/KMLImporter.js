var SModule = require('././SModule.js');
var inherits = require('inherits');
var smartresize = require('.././Smartresize.js');
var helper = require('.././Helper.js')();
var EventType = require('.././EventType.js');

module.exports = KMLImporter;


function KMLImporter(story,opts) {
    if (!(this instanceof KMLImporter)) return new KMLImporter(story, opts);
    this.opts = helper.extend({
        name: 'KMLImporter',
        id: 'KMLImporter'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
	this.story = story;
    return this;
}

inherits(KMLImporter, SModule);

KMLImporter.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('KMLImporter started');
    this.win = this.createModalWindow(
        'Google Location Import Tool', // Title
        { //options
            id: '___KMLImporter',
            content: '<p style="font-size:0.8em">Drop KML here</p>', //html to be displayed
            resizable: false,
            modal: true,
            width: 200,
            height: 150,
            position: {
                top: '20px',
                left: '10px'
            }
        },
        this.UIedit); //parent div

    var myDropzone = new Dropzone("div#___KMLImporter", {
        url: "/storify/uploadKML"
    });
    myDropzone.on("success", function(file, res) {
        //console.info(res);
        self.importKML(res);
    });
    myDropzone.on("complete", function(file) {

    });
    myDropzone.on("uploadprogress", function(file, progress) {

    });
    this.drop = myDropzone;
};

var KMLImporterBackend = require('./services/KMLService.js');
KMLImporter.prototype.importKML = function(res, opts) {
    var start = new Date(res.start)
    var end = new Date(res.end)
    if (this.story.timeline.start.getTime() > start.getTime()) {
        //console.info('need to extend start', this.story.timeline.start, start);
        this.story.timeline.extend(start, this.story.timeline.end);
    }
    if (this.story.timeline.end.getTime() < end.getTime()) {
        //console.info('need to extend end', this.story.timeline.end, end);
        this.story.timeline.extend(this.story.timeline.start, end);
    }
    console.info('Importing events ', res);
    var importer = new KMLImporterBackend(this);
    var events = importer.importGoogleLocation({
        postProcessing: [{
            func: importer.pp.fixNeighbours,
            opts: {
                name: 'fixNeighbours'
            }
        }, 
       {
            func: importer.pp.interpolator,
            opts: {
                name: 'interpolator',
                sensXY: 1000, //m
                sensT: 6 * 60 * 1000 // 3 min
            }
        }, 
        {
            func: importer.pp.reducer,
            opts: {
                name: 'reducer',
                sensXY: 100, //m if two events are one next to each other, merge them
            }
        ,
        }]
    }, res, this.story.timeline); //timeline is needed to get infos about frame, scale etc.etc.

    var real = 0;
    var num = 0;
    var interpolated = 0;
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        this.story.timeline.addEvent(event);
        num++;
        if (event.isReal) real++;
        if (event.interpolated) interpolated++;
    };
    console.info('**********END IMPORT KML************');
    console.info(this.story.timeline);
};

    KMLImporter.prototype.produce = function() {
        var self = this; //things are gonna get nasty
        self.consumers = self.consumers || [];
        if (self.enabled){
            for (var i = 0; i < this.consumers.length; i++) {
                this.consumers[i].consume({},'STORY_UPDATE');
            };
           }
    };