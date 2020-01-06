/**
 * MySecurityCamera
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MySecurityCamera extends CGFobject {
    constructor(scene) {
        super(scene);
        this.screen = new MyRectangle(this.scene, 0.0, 0.5, 0.5, 1);

        this.initShader();
    }
    /**
     * @method initShader
     * Creates shader for security camera 
     */
    initShader() {
        this.securityCameraShader = new CGFshader(this.scene.gl, "./shaders/securityCamera.vert", "./shaders/securityCamera.frag");
        this.securityCameraShader.setUniformsValues({ timeFactor: 0 });
    }

    /**
     * @method display
     * Applies texture and displays screen
     * @param texture - Texture to apply
     */
    display(texture) {
        this.scene.setActiveShader(this.securityCameraShader);
        texture.bind();
        this.screen.display();
        texture.unbind();
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    /**
     * @method update
     * Updates shader's time parameter
     * @param t - Current time
     */
    update(t) {
        this.securityCameraShader.setUniformsValues({ timeFactor: t / 100 % 1000 });
    }
}