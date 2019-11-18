/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.screen = new MyRectangle(this.scene, 1, 0.5, -0.5, -1);

        this.initBuffers();
    }
    initBuffers() {

        this.securityCameraShader = new CGFshader(this.scene.gl, "./shaders/securityCamera.vert", "./shaders/securityCamera.frag");
    }
    display(texture) {
        this.scene.setActiveShader(this.securityCameraShader);
        texture.bind(0);
        this.screen.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
    updateTexCoords(length_s, length_t) {
    }
}