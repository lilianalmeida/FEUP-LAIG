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
    constructor(myinterface) {
        super();
        this.interface = myinterface;
        this.lightsEnabled = {};    // Saves the state of each light defined
        this.materialsChange = 0;   // Increase to be made to each node material array index when processing nodes
        this.lastTime = 0;
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

        this.rttTexture = new CGFtextureRTT(this, this.gl.canvas.width, this.gl.canvas.height);
        this.securityCamera = new MySecurityCamera(this);
        this.board = new MyBoard(this,-4,4,-4,4);

        this.indexForPick = 1;
        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(UPDATE_RATE);

        this.setPickEnabled(true);

        this.defaultMaterial = new CGFappearance(this);
        this.defaultMaterial.setAmbient(0.9, 0.9, 0.9, 1);
        this.defaultMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.defaultMaterial.setSpecular(0.9, 0.9, 0.9, 1);
        this.defaultMaterial.setShininess(10.0);
        this.tex = new CGFtexture(this, "scenes/images/T1.png");
        this.defaultMaterial.setTexture(this.tex);
        this.defaultMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }
    /**
     * Checks key input at each period defined with setUpdatePeriod
     */
    update(currentTime) {
        var deltaTime = currentTime - this.lastTime;

        if (currentTime % 2 == 0 && this.sceneInited) {
            this.checkKey();
        }

        if (this.sceneInited) {
            for (var node in this.graph.nodesGraph) {
                if (this.graph.nodesGraph[node].animation != null) {
                    this.graph.nodesGraph[node].animation.update(deltaTime / 1000);
                }
            }
        }

        this.securityCamera.update(currentTime);

        this.lastTime = currentTime;
    }
    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.cameraDefault = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
        this.cameraRTT = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

        this.camera = this.cameraDefault;
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

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
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);

        this.initLights();

        // Initializes interface controllers
        this.interface.addCameraGroup();
        this.interface.addLightGroup();
        this.interface.initKeys();

        this.initViews();

        this.sceneInited = true;
    }
    /**
     * Initializes scene camera with the parsed default view
     */
    initViews() {
        this.cameraDefault = this.graph.views[this.graph.defaultView];
        this.cameraRTT = this.graph.securityCameras[this.graph.defaultView];
    }
    /**
     * Changes the scene camera when the current view is changed in the interface
     */
    changeView() {
        this.cameraDefault = this.graph.views[this.interface.cameraIndex];
        this.cameraRTT = this.graph.securityCameras[this.interface.securityCameraIndex];
    }
    /**
     * Checks if key 'M' is pressed and increments the current array material index for each node
     */
    checkKey() {
        if (this.interface.isKeyPressed('KeyM')) {
            this.materialsChange++;
        }
    }

    logPicking() {
		if (this.pickMode == false) {
			if (this.pickResults != null && this.pickResults.length > 0) {
				for (var i = 0; i < this.pickResults.length; i++) {
					var obj = this.pickResults[i][0];
					if (obj) {
						var customId = this.pickResults[i][1];
						console.log("Picked object: " + obj + ", with pick id " + customId);						
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
        if (this.sceneInited) {
            // Draw axis
            this.setDefaultAppearance();
            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        this.defaultMaterial.apply();
        this.board.display();
        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}