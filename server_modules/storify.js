var xml2js = require('xml2js');
var fs = require('fs');
var ExifImage = require('exif').ExifImage;


exports = module.exports = function($) {
    var self = this; //things are gonna get nasty
    self.parseKML = function(content, callback) {
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

    self.parsePhoto = function(content, _path,_name, callback) {
        try {
            new ExifImage({ image : _path }, function (error, exifData) {
                //console.log(error,exifData);
                var ret ={};
                ret.exif = exifData;
                ret.path = _name;
                if (error)
                    callback(error,ret);
                else{
                    callback(null,ret); // Do something with your data! 
                }
            });
        } catch (error) {
            console.log('Error: ' + error.message);
        }
    };



    return self;
};
