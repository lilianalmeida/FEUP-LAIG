/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        this.initKeys();

        return true;
    }

    /**
     * Adds a dropdown box to select a ID view from all views available
     */
    addCameraGroup() {
        this.viewsVec = Object.keys(this.scene.graph.views);
        this.securityViewsVec = Object.keys(this.scene.graph.securityCameras);

        this.cameraIndex = this.scene.graph.defaultView;
        this.securityCameraIndex = this.scene.graph.defaultView;

        this.gui.add(this, 'cameraIndex', this.viewsVec).name('View').onChange(this.scene.changeView.bind(this.scene));
        this.gui.add(this, 'securityCameraIndex', this.securityViewsVec).name('SC View').onChange(this.scene.changeView.bind(this.scene));
    }

    /**
     * Adds a folder with checkboxes for all ligths IDs
     */
    addLightGroup() {
        var lightsGroup = this.gui.addFolder("Lights");
        lightsGroup.close();

        var i = 0;
        for (var key in this.scene.graph.lights) {
            if (this.scene.graph.lights.hasOwnProperty(key)) {
                this.scene.lightsEnabled[i] = this.scene.graph.lights[key][0];
                lightsGroup.add(this.scene.lightsEnabled, i).name(key);
            }
            i++;
        }
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;

    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}