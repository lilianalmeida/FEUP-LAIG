/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param id - id of the primitive
 * @param inner - "tube" radius
 * @param outer - Radius of the "circular axis" of the torus
 * @param slices - Number of divisions around the inner radius
 * @param loops - Number of divisions around the "circular axis"
 */
class MyTorus extends CGFobject {
    constructor(scene, id, inner, outer, slices, loops) {
        super(scene);
        this.id = id;
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        //Angle between each slice
        var theta = 0;
        var deltaTheta = 2 * Math.PI / this.slices;

        //Angle between each loop
        var phi = 0;
        var deltaPhi = 2 * Math.PI / this.loops;

        for (var j = 0; j <= this.loops; j++) {
            //Reinitialize theta
            theta = 0;
            for (var i = 0; i <= this.slices; i++) {

                //Normal components
                var nx = Math.cos(theta) * Math.cos(phi);
                var ny = Math.cos(theta) * Math.sin(phi);
                var nz = Math.sin(theta);

                //Vertices coordinates
                var x = (this.outer + this.inner * Math.cos(theta)) * Math.cos(phi);
                var y = (this.outer + this.inner * Math.cos(theta)) * Math.sin(phi);
                var z = nz * this.inner;

                this.vertices.push(x, y, z);

                //Normal
                var normal = [
                    nx,
                    ny,
                    nz
                ];

                //Normal normalization
                var nsize = Math.sqrt(
                    normal[0] * normal[0] +
                    normal[1] * normal[1] +
                    normal[2] * normal[2]
                );
                normal[0] /= nsize;
                normal[1] /= nsize;
                normal[2] /= nsize;

                this.normals.push(...normal);

                //Texture Coordinates - TO DO!
                this.texCoords.push(phi / (Math.PI * 2), phi);

                //Next theta for next slice
                theta += deltaTheta;
            }

            //Next phi for next loop
            phi += deltaPhi;
        }

        //Generates torus surface
        for (var j = 0; j < this.loops; j++) {
            for (var i = 0; i < this.slices; i++) {
                //Vertices indexes
                var v1 = (this.slices + 1) * j + i;          //Vertex in loop = j and slice = i
                var v3 = (this.slices + 1) * (j + 1) + i;    //Vertex in loop = j+1 and slice = i

                this.indices.push(v1 + 1, v1, v3 + 1);
                this.indices.push(v3 + 1, v1, v3);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the torus
	 * @param {real} length_s - texture scale factor in s axis
	 * @param {real} length_t - texture scale factor in t axis
	 */
    updateTexCoords(length_s, length_t) {
    }
}