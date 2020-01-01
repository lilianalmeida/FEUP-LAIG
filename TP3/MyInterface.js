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
        this.configGame();
        this.initKeys();

        return true;
    }

    configGame() {
        var settingsFolder = this.gui.addFolder("Settings");
        settingsFolder.open();
        this.levels = Object.keys(this.scene.gameOrchestrator.levels);
        this.level = "easy";
        settingsFolder.add(this, 'level', this.levels).name('Level').onChange(this.scene.gameOrchestrator.changeLevel.bind(this.scene.gameOrchestrator));        

        this.modes = Object.keys(GameMode);
        this.mode = "pvp";
        settingsFolder.add(this, 'mode', this.modes).name('Mode').onChange(this.scene.gameOrchestrator.changeMode.bind(this.scene.gameOrchestrator));
        settingsFolder.add(this.scene.gameOrchestrator,'newGame').name('New Game');
        settingsFolder.add(this.scene.gameOrchestrator,'undo').name('Undo');

    }

    addCameraGroup() {
        var camerasGroup = this.gui.addFolder("Cameras");
        camerasGroup.open();
        console.log(this.scene.gameOrchestrator.theme);
        this.viewsVec = Object.keys(this.scene.gameOrchestrator.theme.views);
        this.securityViewsVec = Object.keys(this.scene.gameOrchestrator.theme.securityCameras);

        this.cameraIndex = this.scene.gameOrchestrator.theme.defaultView;
        this.securityCameraIndex = this.scene.gameOrchestrator.theme.defaultView;

        camerasGroup.add(this, 'cameraIndex', this.viewsVec).name('View').onChange(this.scene.changeView.bind(this.scene));
    }

    /**
     * Adds a folder with checkboxes for all ligths IDs
     */
    addLightGroup() {
        var lightsGroup = this.gui.addFolder("Lights");
        lightsGroup.close();

        var i = 0;
        for (var key in this.scene.gameOrchestrator.theme.lights) {
            if (this.scene.gameOrchestrator.theme.lights.hasOwnProperty(key)) {
                this.scene.lightsEnabled[i] = this.scene.gameOrchestrator.theme.lights[key][0];
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