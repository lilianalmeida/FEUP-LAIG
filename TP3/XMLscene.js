var DEGREE_TO_RAD = Math.PI / 180;
var UPDATE_RATE = 1000 / 60;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface, filename) {
        super();
        this.interface = myinterface;
        this.lightsEnabled = {};    // Saves the state of each light defined
        this.lastTime = 0;
        this.filename = filename;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);
        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.gameOrchestrator = new MyGameOrchestrator(this, this.filename);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(UPDATE_RATE);

        this.indexForPick = 1;
        this.setPickEnabled(true);

    }
    /**
     * Checks key input at each period defined with setUpdatePeriod
     */
    update(currentTime) {
        var deltaTime = currentTime - this.lastTime;

        if (currentTime % 2 == 0 && this.sceneInited) {

        }

        this.gameOrchestrator.update(deltaTime);

        this.lastTime = currentTime;
    }
    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.cameraDefault = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

        this.camera = this.cameraDefault;
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        let graph = this.gameOrchestrator.theme;

        // Lights index.
        var i = 0;

        // Reads the lights from the scene graph.
        for (var key in graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (graph.lights.hasOwnProperty(key)) {
                var light = graph.lights[key];

                this.lights[i].setPosition(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setAmbient(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setDiffuse(light[4][0], light[4][1], light[4][2], light[4][3]);
                this.lights[i].setSpecular(light[5][0], light[5][1], light[5][2], light[5][3]);

                // Reads ligth attenuation
                if (light[6] == "constant") {
                    this.lights[i].setConstantAttenuation(1.0);
                } else if (light[6] == "linear") {
                    this.lights[i].setLinearAttenuation(1.0);
                } else {
                    this.lights[i].setQuadraticAttenuation(1.0);
                }

                if (light[1] == "spot") {
                    this.lights[i].setSpotCutOff(light[7]);
                    this.lights[i].setSpotExponent(light[8]);
                    this.lights[i].setSpotDirection(light[9][0], light[9][1], light[9][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
            console.log(this.lights);
        }
    }
    setDefaultAppearance() {
        this.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.setShininess(10.0);
    }
    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        let graph = this.gameOrchestrator.theme;
        this.axis = new CGFaxis(this, graph.referenceLength);

        this.gl.clearColor(graph.background[0], graph.background[1], graph.background[2], graph.background[3]);

        this.setGlobalAmbientLight(graph.ambient[0], graph.ambient[1], graph.ambient[2], graph.ambient[3]);

        this.initLights();

        // Initializes interface controllers
        //this.interface.addCameraGroup();
        this.interface.addLightGroup();
        //this.interface.initKeys();

        this.initViews();

        this.sceneInited = true;
    }
    /**
     * Initializes scene camera with the parsed default view
     */
    initViews() {
        let graph = this.gameOrchestrator.theme;
        this.cameraDefault = graph.views[graph.defaultView];
    }
    /**
     * Changes the scene camera when the current view is changed in the interface
     */
    changeView() {
        let graph = this.gameOrchestrator.theme;
        this.cameraDefault = graph.views[this.interface.cameraIndex];
    }
    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        var customId = this.pickResults[i][1];
                        console.log("Picked object: " + obj.constructor.name + ", with pick id " + customId);
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }

    /**
     * Displays the scene.
     */
    display() {
        /**this.rttTexture.attachToFrameBuffer();
        this.render(this.cameraRTT);
        this.rttTexture.detachFromFrameBuffer();*/
        this.render(this.cameraDefault);

        /**  this.gl.disable(this.gl.DEPTH_TEST);
         this.securityCamera.display(this.rttTexture);
         this.gl.enable(this.gl.DEPTH_TEST); */
    }
    /**
     * Renders the scene applying the camera given.
     */
    render(camera) {
        // ---- BEGIN Background, camera and axis setup

        this.gameOrchestrator.orchestrate();

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        this.camera = camera;
        this.interface.setActiveCamera(this.camera);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();
        this.axis.display();

        this.logPicking();
        this.clearPickRegistration();
        this.indexForPick = 1;

        // Sets lights state (ON or OFF) and visibility according to its state in the interface
        for (var i = 0; i < this.lights.length; i++) {
            if (this.lightsEnabled[i]) {
                this.lights[i].setVisible(true);
                this.lights[i].enable();
            } else {
                this.lights[i].setVisible(false);
                this.lights[i].disable();
            }
            this.lights[i].update();
        }
        var i = 0;

        this.gameOrchestrator.display();
        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}