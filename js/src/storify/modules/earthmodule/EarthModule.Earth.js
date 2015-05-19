var helper = require('../../Helper.js')();


var EARTH_SIZE = 600;
var POS_X = 0;
var POS_Y = 0;
var POS_Z = 0;

var POS_X_L = 3000;
var POS_Y_L = 0;
var POS_Z_L = 3000;

module.exports = EarthModuleObjEarth;

function EarthModuleObjEarth(parent, opts) {
    if (!(this instanceof EarthModuleObjEarth)) return new EarthModuleObjEarth(parent, opts);
    opts = helper.extend({
        name: 'EarthModuleObjEarth',
        id: 'EarthModuleObjEarth'
    }, opts);

    this.parent = parent;
    return this;
}

/**
 * init
 *      this.renderer
 *      this.camera
 *      this.controls
 * @return {[type]} [description]
 */
EarthModuleObjEarth.prototype.start = function(callback) {
    var self = this; //things are gonna get nasty
    var parent = self.parent;
    var hw = parent.hw;
    var sm = parent.sm;
    var scene = sm.scene;
    console.info('creating subscene', scene);
    var subscene = new THREE.Object3D();

    

    
    //STARFIELD


    //EARTH
    hw.loadTexture([{ //Big textures, ask for help from hw module
            id: 'planet',
            file: '/assets/images/nteam/2_no_clouds_4k.jpg'
        }, {
            id: 'bump',
            file: '/assets/images/nteam/elev_bump_4k.jpg'
        }, {
            id: 'specular',
            file: '/assets/images/nteam/water_4k.png'
        }, ],
        function(textures) { //asyncWay, earth is added once textures are loaded
            self.createEarth(subscene, textures, function(earth) {
                self.earthMesh = earth; //mesh
                self.addBackground(subscene);
                self.addLights(subscene);
                self.earthMesh.castShadow = false;
                self.earthMesh.receiveShadow = true;
                subscene.add(earth);
                self.addClouds(earth,4,8,25);

            });
        }
    );
    //add subscene to the main scene
    self.subscene = subscene;
    scene.add(self.subscene);
    console.info('added planet earth', scene);
    return self;
};



EarthModuleObjEarth.prototype.addClouds = function(scene,size, rotx,roty) {
    var radius = EARTH_SIZE;
    var segments = 32;
    var self = this; //things are gonna get nasty
    var addOne = function() {
        var mesh = new THREE.Mesh(
            new THREE.SphereGeometry(radius + size, segments, segments),
            new THREE.MeshPhongMaterial({
                map: THREE.ImageUtils.loadTexture('/assets/images/nteam/fair_clouds_4k.png'),
                color: 0xffffff,
                transparent: true,
                opacity: 0.8,
            })
        );
        mesh._eid = new Date().getTime();
        scene.add(mesh);        
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        self.parent.bindToProducer(function(framecount) { //create an anonymous module attached to the frame producer
            if (mesh) {
                mesh.rotation.y += (roty / 30000);
                mesh.rotation.x += (rotx / 30000);
                mesh.rotation.z += ((rotx+roty)/2 / 30000);
            }
        }, self.parent);
    }
    addOne(size,rotx,roty);
};

EarthModuleObjEarth.prototype.addLights = function(scene) {
    scene.add(new THREE.AmbientLight(0x151515));
    var sun = new THREE.DirectionalLight(0xffaaaa, 1);
    sun.position.set(POS_X_L, POS_Y_L, POS_Z_L);
    sun.lookAt(POS_X, POS_Y, POS_Z);
    sun.castShadow = true;
    sun.shadowCameraVisible = false; //set true to see shadow frustum
    sun.intensity = 0.8;
    sun.shadowCameraNear = 1000;
    sun.shadowCameraFar = 250000000;
    sun.shadowBias = 0.0001;
    sun.shadowDarkness = 0.35;
    sun.shadowMapWidth = 1024; //512px by default
    sun.shadowMapHeight = 1024; //512px by default    
    this.sun = sun;
    scene.add(this.sun);

    //this.addSun(scene);
};
EarthModuleObjEarth.prototype.createDebugLine = function() {

    var material = new THREE.LineBasicMaterial({
        color: 0xfdfff00
    });
    if (this.sun && this.earthMesh) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(this.sun.position);
        geometry.vertices.push(this.earthMesh.position);
        if (this.line) this.subscene.remove(this.line);
        this.line = new THREE.Line(geometry, material);
        this.subscene.add(this.line);
    }
}
EarthModuleObjEarth.prototype.addSun = function(scene) {
    var self = this; //things are gonna get nasty
    var geometry = new THREE.SphereGeometry(EARTH_SIZE * 10, 32, 16);
    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: false,
        opacity: 1,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(POS_X_L, POS_Y_L, POS_Z_L);
};


EarthModuleObjEarth.prototype.addBackground = function(scene) {
    var radius = 3500;
    var segments = 32;
    var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, segments),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('/assets/images/nteam/galaxy_starfield.png'),
            side: THREE.BackSide
        })
    );
    scene.add(mesh);
};




EarthModuleObjEarth.prototype.createEarth = function(scene, textures, callback) {
    var self = this;
    var geo = new THREE.SphereGeometry(EARTH_SIZE, 50, 50);
    geo.position = new THREE.Vector3(0, 0, 0);
    var mesh = new THREE.Mesh(
        geo,
        new THREE.MeshPhongMaterial({
            map: textures['planet'], //THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
            bumpMap: textures['bump'], //THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
            bumpScale: 5.50,
            specularMap: textures['specular'], //THREE.ImageUtils.loadTexture('images/water_4k.png'),
            specular: new THREE.Color('grey')
        })
    );

    callback(mesh);
};


EarthModuleObjEarth.prototype.setEarthRotation = function(degree) {
    if (this.earthMesh)
        this.earthMesh.rotation.y = degree * Math.PI / 180 // Rotates  45 degrees per frame
};


/*
    var POS_X_L = 12080;
var POS_Y_L = 0;
var POS_Z_L = 12080;
 */
EarthModuleObjEarth.prototype.setSunPosition = function(__date) {
    if (this.sun) {
        var date = new Date(__date);
        var d = helper.dayOfTheYear(date);
        var dayOfTheYear = (d - 91 + 365) % 365;
        var l = 1800;
        var seasons = [{
            limit: [0, 91],
            angle: [0, l],
            id: 'A'
        }, {
            limit: [92, 172],
            angle: [l, 0],
            id: 'B'
        }, {
            limit: [173, 266],
            angle: [0, -l],
            id: 'C'
        }, {
            limit: [266, 365],
            angle: [-l, 0],
            id: 'D'
        }];
        var tilt = 0;
        for (var i = 0; i < seasons.length; i++) {
            var limit = seasons[i].limit;
            var angle = seasons[i].angle;
            if (dayOfTheYear >= limit[0] && dayOfTheYear < limit[1]) {
                tilt = helper.interpolate(dayOfTheYear + (date.getHours() / 24), limit[0], limit[1], angle[0], angle[1]);
                //console.info(seasons[i].id, d, dayOfTheYear, tilt.toFixed(0));
                break;
            }
        };



        var rev_degree = -(((__date / (1000 * 60 * 60)) + 6) % 24) * (360 / 24)
        var tilt_deg = tilt;


        this.sun.position.set(Math.sin(rev_degree * Math.PI / 180) * POS_X_L, tilt_deg, POS_Z_L * Math.cos(rev_degree * Math.PI / 180));
        this.sun.lookAt(POS_X, POS_Y, POS_Z);
    }
};

/*

mesh.rotation.x += 1;                      // Rotates   1 radian  per frame
mesh.rotation.x += Math.PI / 180;          // Rotates   1 degree  per frame
mesh.rotation.x += 45 * Math.PI / 180      // Rotates  45 degrees per frame

 */
