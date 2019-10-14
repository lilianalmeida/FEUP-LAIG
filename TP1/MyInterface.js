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

        // add a group of controls (and open/expand by default)



        this.initKeys();

        return true;
    }

    addCameraGroup() {
        this.viewsVec = Object.keys(this.scene.graph.views);
        this.cameraIndex = this.scene.graph.defaultView;
        this.gui.add(this, 'cameraIndex', this.viewsVec).name('View').onChange(this.scene.changeView.bind(this.scene));
    }

    addLightGroup() {
        for (var key in this.scene.graph.lights) {
            if (this.scene.lights.hasOwnProperty(key)){
            this.lightsEnabled[key] = this.scene.lights[key][0];
           // this.lname = "lights["+key+"][0]";
            //this.gui.add(this.scene, 'lights[key][0]').name(key);
            this.gui.add(this.lightsEnabled, key);

            }

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
        console.log(event.code);
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        console.log(event.code);
        this.activeKeys[event.code] = false;

    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}