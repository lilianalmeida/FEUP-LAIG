/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.screen = new MyRectangle(scene, 0.0075 * this.scene.gl.canvas.width, 0.01 * this.scene.gl.canvas.width, 0.01 * this.scene.gl.canvas.heigth, 0.0075 * this.scene.gl.canvas.heigth);
        console.log(0.01 * this.scene.gl.canvas.width);
        console.log(0.0075 * this.scene.gl.canvas.width);
        this.initBuffers();
    }
    initBuffers() {
        
        this.securityCameraShader = new CGFshader(this.scene.gl, "./shaders/securityCamera.vert", "./shaders/securityCamera.frag");
    }
    display(texture) {
        this.scene.setActiveShader(this.securityCameraShader);
        texture.bind(1);
        this.screen.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
    updateTexCoords(length_s, length_t) {
    }
}