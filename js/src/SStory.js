//SStory

var helper = require('./helper.js')();

module.exports = SStory;

function SStory(app, opts) {
    var self = this;
    this.opts = helper.extend({}, opts);
    if (!(this instanceof SStory)) return new SStory(app, opts);
    this.app = app;
    this.startTime = opts.startTime || new Date().getTime();
    this.endTime = opts.endTime || new Date().getTime();
	this.title = this.opts.title || 'untitled story';
	this.description = this.opts.description || 'new story to be filled';
	this.createdOn = this.opts.createdOn || helper.dateToString(new Date());
    this.importKmlEvents = function(data) {  
        var kmlEvents = [];
        var changeDate = false;
        if (new Date(data[0].when).getTime()<self.startTime) {        
            self.startTime = new Date(data[0].when).getTime();
            console.info('Start moved to ' + new Date(self.startTime));
            changeDate = true;
        }
        if (new Date(data[data.length-1].when).getTime()>self.endTime) {
            self.endTime = new Date(data[data.length-1].when).getTime();
            console.info('End moved to ' + new Date(self.endTime));
            changeDate = true;
        }
        if(changeDate ){
            self.app.bus.publish('EVENT.STORY.REFRESH.DATE');
        }
        //for (var i = 0 ; i < data.length; i++) {
        //    var startTime = new Date(data[i].when).getTime();
        //    kmlEvents.push({type: 'kml', when: startTime, where: data[i].where});
        //};
        //self.app.bus.publish('EVENT.STORY.REFRESH.KML',{events: kmlEvents});
    };
    return self;
}

/*SStory.prototype.getEvents = function(type) {
    function hasType(_event) {
        return _event.type === type;
    }
    return this.events.filter(hasType);
};
*/
SStory.prototype.parseKML = function(content, callback) {
	xml2js.parseString(content, function(err, result) {
    	if (err) {
            callback(err, null);
        }
        var when = result.kml.Document[0].Placemark[0]['gx:Track'][0].when;
        var where = result.kml.Document[0].Placemark[0]['gx:Track'][0]['gx:coord'];
        /**
        * start : DATE
        * end : DATE
        * points : []
        */
        var obj = {};
        obj.ret = [];
        obj.start = new Date(when[0]);
        obj.end = new Date(when[when.length - 1]);		
		for (var ii = 0; ii < when.length; ii++) {
        	var event = {
               'when': new Date(when[ii]),
               'where': {
                    lng: where[ii].split(' ')[0],
                    lat: where[ii].split(' ')[1]
                }
            };
            obj.ret.push(event);
        }
        callback(null, obj);
	});
};
