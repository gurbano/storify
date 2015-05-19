var SModule = require('./../SModule.js');
var inherits = require('inherits');
var smartresize = require('../../Smartresize.js');
var helper = require('../../Helper.js')();
var EventType = require('../../EventType.js');

module.exports = SSEntityFactory;


function SSEntityFactory(opts) {
    if (!(this instanceof SSEntityFactory)) return new SSEntityFactory(opts);
    this.opts = helper.extend({
        name: 'SSEntityFactory',
        id: 'SSEntityFactory'
    }, opts);
    /*CALL SUPERCLASS*/
    SModule.call(this, this.opts);
    this.tm = opts.tm;
    this.start();
    return this;
}

inherits(SSEntityFactory, SModule);

SSEntityFactory.prototype.postInit = function() {
    var self = this; //things are gonna get nasty
    console.info('SSEntityFactory started');
};

SSEntityFactory.prototype.getSphere = function(radius, material) {
    var sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 100, 100), material || new THREE.MeshNormalMaterial());
    sphere.overdraw = true;
    return sphere
};

SSEntityFactory.prototype.getTerrainMaterial = function() {
    return new THREE.MeshPhongMaterial( 
        { vertexColors: THREE.VertexColors, 
            texture: this.tm.get('playa'),
            shading: THREE.FlatShading, 
            specular: 0xffffff, side: THREE.DoubleSide } );
        
    
        // t1, t2, t3, and t4 must be textures, e.g. loaded using `THREE.ImageUtils.loadTexture()`.
        // The function takes an array specifying textures to blend together and how to do so.
        // The `levels` property indicates at what height to blend the texture in and out.
        // The `glsl` property allows specifying a GLSL expression for texture blending.
        // The first texture is the base; other textures are blended in on top.
    return  THREE.Terrain.generateBlendedMaterial([
    
    {texture: this.tm.get('playa')},

        // Start blending in at height -80; opaque between -35 and 20; blend out by 50
        //{texture: t2, levels: [-80, -35, 20, 50]},
        //{texture: t3, levels: [20, 50, 60, 85]},
        // How quickly this texture is blended in depends on its x-position.
        //{texture: t4, glsl: '1.0 - smoothstep(65.0 + smoothstep(-256.0, 256.0, vPosition.x) * 10.0, 80.0, vPosition.z)'},
        // Use this texture if the slope is between 27 and 45 degrees
        //{texture: t3, glsl: 'slope > 0.7853981633974483 ? 0.2 : 1.0 - smoothstep(0.47123889803846897, 0.7853981633974483, slope) + 0.2'},
    ]);
    

    //turn new THREE.MeshBasicMaterial({map: this.tm.get('playa')})
};

SSEntityFactory.prototype.createTerrain = function(w, h) {
    var xS = 128, yS = 128;
    terrainScene = THREE.Terrain({
        easing: THREE.Terrain.Linear,
        frequency: 5.5,
        heightmap: THREE.Terrain.DiamondSquare,
        //material: new THREE.MeshBasicMaterial({wireframe: true}),
        material: this.getTerrainMaterial(),
        maxHeight: 120,
        minHeight: -120,
        steps: 1,
        useBufferGeometry: false,
        xSegments: xS,
        xSize: 2048,
        ySegments: yS,
        ySize: 2048,
    });
    return terrainScene;
};

SSEntityFactory.prototype.createLights = function() {
    //new THREE.AmbientLight(0x151515);
    var sun = new THREE.DirectionalLight(0xffaaaa, 1);
    //sun.position.set(POS_X_L, POS_Y_L, POS_Z_L);
    //sun.lookAt(POS_X, POS_Y, POS_Z);
    sun.castShadow = true;
    sun.shadowCameraVisible = false; //set true to see shadow frustum
    sun.intensity = 0.8;
    sun.shadowCameraNear = 1000;
    sun.shadowCameraFar = 250000000;
    sun.shadowBias = 0.0001;
    sun.shadowDarkness = 0.35;
    sun.shadowMapWidth = 1024; //512px by default
    sun.shadowMapHeight = 1024; //512px by default    
    return sun;
};

SSEntityFactory.prototype.createAxis = function(x, y, z) {
    var axisLength = 850;
    var createAxis = function(p1, p2, color, width) {
        var line, lineGeometry = new THREE.Geometry(),
        lineMat = new THREE.LineBasicMaterial({
            color: color,
            lineWidth: width
        });
        lineGeometry.vertices.push(p1, p2);
        line = new THREE.Line(lineGeometry, lineMat);
        return line;
    }
    var group = new THREE.Object3D(); //create an empty container 
    if (x) group.add(createAxis(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000, 1));
    if (y) group.add(createAxis(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00, 1));
    if (z) group.add(createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF, 1));
    return group;
};

function v(x, y, z) {
    return new THREE.Vector3(x, y, z);
}

THREE.Mesh.prototype.moveAt = function(x, y, z) {
    this.position.set(x, y, z);
    return this;
};
THREE.DirectionalLight.prototype.moveAt = function(x, y, z) {
    this.position.set(x, y, z);
    return this;
};
THREE.DirectionalLight.prototype.lookTo = function(x, y, z) {
    this.lookAt(x, y, z);
    return this;
};

