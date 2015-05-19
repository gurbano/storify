var Storify = {}; //namespace

var helper = require('./Helper.js')();
var StoryFactory = require('./StoryFactory.js');
//watchify .\public\js\storify\storify.js -o .\public\js\storify\dist\storify.bundle.js

init = function(_GLOBALS) {
    GLOBALS = _GLOBALS;
    var goSocial = false;
    if (goSocial) {
        GLOBALS.usm.start(false)
            .login({
                method: 'facebook'
            }, function success(user) {
                console.info("You are signed in to Facebook");
                console.info(user);
                $('#profilepic').css('background-image', 'url(' + user.picture + ')');
                GLOBALS.usm.getPosition(function(err, position) {
                    GLOBALS.position = position || {
                        coords: {
                            latitude: 0,
                            longitude: 0
                        }
                    };
                    startStorify(null, user);
                }, 5000);
            }, function failure(err) {
                console.info(err, null);

            });
    } else {
        GLOBALS.position = {
            coords: {
                latitude: 0,
                longitude: 0
            }
        };
        startStorify(null, null);
    }
};

//require Story --> Timeline --> Frame --> Event
var Story = require('./Story.js');
var StoryFactory = require('./StoryFactory.js');
var Wizard = require('./Wizard.js');
var SEngine = require('./engine/SEngine.js');
var SModule = require('./modules/SModule.js');
var GMapModule = require('./modules/GMapModule.js');
var SModule = require('./modules/SModule.js');
var ModulesManager = require('./modules/ModulesManager.js');
var CustomClickModule = require('./modules/CustomClickModule.js');
//SOURCES
var SourcesManager = require('./modules/SourcesManager.js');
var PlayBackModule = require('./modules/PlayBackModule.js');

var TimelineModule = require('./modules/TimelineModule.js');
var EditSwitch = require('./modules/UI/UISwitcher.js');

var DisplayPathModule = require('./modules/DisplayPath.js');
var FacebookSourcesModule = require('./modules/sources/FacebookSourcesModule.js');

var KMLImporter = require('./modules/KMLImporter.js');

var startStorify = function(err, user) {
    if (err) {
        swal({
            title: "Error",
            text: "Facebook login is required for this experiment!",
            type: "error",
            confirmButtonText: "too bad :("
        });
        return;
    } else {

        var story = new StoryFactory({
            title: 'USA',
            description: '#Roadtrip #California #Nevada #Burningman',
            timelineOpts: {
                start: new Date('09/01/2014'),
                end: new Date('09/02/2014'),
                scale: 1 //1 frame every 10 minutes.
            },
        }).generate();
        //console.info($.toJSON(story));
        console.info(story);

        /*CREATE MODULES*/
        /*SUPERMODULES*/
        var uiSwitcher = new EditSwitch({ //Move marker, show map ecc.ecc.
            parent: $('#main'),enabled:true
        });
        var mm = new ModulesManager({
            parent: $('#UI-EDIT'),enabled:true
        });
        /*SOURCES*/
        var sm = new SourcesManager({enabled:false}).addProducer(mm);
        var fsm = new FacebookSourcesModule({story:story, enabled:false}).addProducer(sm);

        /*TIMELINE*/
        var importer = new KMLImporter(story, {
            enabled: true
        });
        var tmm = new TimelineModule(story, {enabled:true, edit:true, view:true}).addProducer(mm); //edit timeline module
        /*EDIT*/

        var gmm = new GMapModule(story, { //Move marker, show map ecc.ecc.
            parent: $('#main'),enabled:false
        })
        .addProducer(tmm).require('tmm', tmm);

        //attached to modules manager, attached to timeline, require google maps 
        var displayPath = new DisplayPathModule({ //Move marker, show map ecc.ecc.
            parent: $('#main'),
            enabled:true
        }).addProducer(mm).addProducer(tmm).require('gmm', gmm); 


        /*VIEW*/
        var playback = new PlayBackModule(
            new CustomClickModule(1  , {enabled: true, autoStart:false}),
            {enabled:true, maxSpeed: 15}
        ).require('tmm', tmm);
        
        /*CLOCK ON TOP*/
        var timezoneadj = - 8 *( 1000 * 60 * 60);
        var dateDisplayer = new SModule({
            enabled: true,
            name: 'dateDisplayer',
            callbacks: {
                postInit: function() {
                    $('#UI-VIEW').prepend('<div class="button raised grey" style="width:300px;height:30px;position:absolute;margin-left:-100px;top:50px;left:50%;text-align:center;font-size: xx-large;font-family: sans-serif" id="__clock_V"></div>');
                    $('#UI-EDIT').prepend('<div class="button raised grey" style="width:300px;height:30px;position:absolute;margin-left:-100px;top:50px;left:50%;text-align:center;font-size: xx-large;font-family: sans-serif" id="__clock_E"></div>');
                },
                consume: function(frame) { 
                    var  time = frame.time + (timezoneadj);
                    $('#__clock_V').html(helper.msToString(time));
                    $('#__clock_E').html(helper.msToString(time));
                }
            }
        }).addProducer(tmm);
        var speedDisplayer = new SModule({
            enabled: true,
            name: 'dateDisplayer',
            callbacks: {
                postInit: function() {
                    $('#UI-VIEW').prepend('<div class="button raised grey" style="width:300px;height:30px;position:absolute;bottom:10%;left:0%;text-align:center;font-size: xx-large;font-family: sans-serif" id="__speed_V"></div>');  
                },                 
                consume: function(frame) {
                    var posev = frame.getPositionEvent();
                    if (posev && posev.speed){
                        var s = posev.isReal ? '' : '*';
                        $('#__speed_V').html(posev.speed.kmh + ' km/h' + s);
                    }
                    
                }
            }
        }).addProducer(tmm);

        /*POSTINIZIALIZER*/
        var postInitializer = new SModule({
            name: 'onTheRockModule',
            id: 'ONTHEROCK',
            postInit: function() {
                console.info('All modules started');
                return this;
            }
        });

        var engine = new SEngine().start(
            [ //MODULES
                /*GENERAL PURPOSE MODULES*/
                mm, //module manager
                uiSwitcher, // switch between edit and view

                /*SOURCE // EDITORS // */
                sm, //sources manager
                fsm, //facebook source module
                importer, //KMLImporter
                tmm, //timeline


                /*VIEW*/                
                gmm, //google maps
                playback, //playback bar 
                displayPath, //display interpolated paths and skipped events on gmap
                dateDisplayer,
                speedDisplayer,
                postInitializer // anonymous module on complete
            ]
        );

    }
};









/*SKIP WIZARD NOW
        if (false) {
            swal({ //WELCOME PAGE
                title: "Welcome " + user.first_name,
                text: "Here you will create your first story.\n Are you ready?",
                type: "success",
                confirmButtonText: "Can't wait to tell a Story!",
                closeOnConfirm: true
            }, function() {
                new Wizard('Create a story', [step1], //, step2, step3], //STEPS
                    function(context) { //FUNCTION TO BE EXCECUTED AT THE END OF THE WIZARD
                        GLOBALS.pb.set(100);

                        console.info(new Story({
                            author: user.id
                        }));
                        console.info(context);
                    }).start();
            });
        }


var step1 = {
    first: true,
    last: true,
    data: {
        text: ''
    },
    callback: function(obj, context) {
        GLOBALS.pb.set(10);
        context.title = 'My first story';
        context.wizard.getHelper(obj)
            .addTextField('Title', context.title, function(value) {
                context.title = value;
            })
            .addTextField('Description', context.description, function(value) {
                context.description = value;
            })
            .addDateField('From', context.from, function(value) {
                context.from = value;
            }).addDateField('To', context.to, function(value) {
                context.to = value;
            }).focus();
        console.info(obj, context);
    }
};
require()

var step2 = {
    data: {
        text: 'step 2'
    },
    callback: function(obj, context) {
        GLOBALS.pb.set(20);
        context.variable++;
        console.info(obj, context);

    }
};
var step3 = {
    last: true,
    data: {
        text: 'step 3'
    },
    callback: function(obj, context) {
        GLOBALS.pb.set(30);
        context.variable = 200;
        console.info(obj, context);
    }
};


*/
