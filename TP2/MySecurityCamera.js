/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.screen = new MyRectangle(this.scene, 0.5, 1, -1, -0.5);

        this.initBuffers();
    }
    initBuffers() {

        this.securityCameraShader = new CGFshader(this.scene.gl, "./shaders/securityCamera.vert", "./shaders/securityCamera.frag");
        this.securityCameraShader.setUniformsValues({ timeFactor: 0 });
    }
    display(texture) {
        this.scene.setActiveShader(this.securityCameraShader);
        texture.bind(0);
        this.screen.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
    update(t) {
        this.securityCameraShader.setUniformsValues({ timeFactor: t / 100 % 1000 });
    }
    updateTexCoords(length_s, length_t) {
    }
}