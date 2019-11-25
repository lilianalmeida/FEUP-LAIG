/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - X coordinate of the first vertex 
 * @param x2 - X coordinate of the second vertex 
 * @param x3 - X coordinate of the third vertex 
 * @param y1 - Y coordinate of the first vertex 
 * @param y2 - Y coordinate of the second vertex 
 * @param y3 - Y coordinate of the third vertex 
 * @param z1 - Z coordinate of the first vertex 
 * @param z2 - Z coordinate of the second vertex 
 * @param z3 - Z coordinate of the third vertex 
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
		super(scene);
		this.x1 = x1;
		this.x2 = x2;
		this.x3 = x3;
		this.y1 = y1;
		this.y2 = y2;
		this.y3 = y3;
		this.z1 = z1;
		this.z2 = z2;
		this.z3 = z3;

		this.initBuffers();
	}
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, this.z1, 	//0
			this.x2, this.y2, this.z2,	//1
			this.x3, this.y3, this.z3	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.a = Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + (this.y2 - this.y1) * (this.y2 - this.y1) + (this.z2 - this.z1) * (this.z2 - this.z1));
		this.b = Math.sqrt((this.x3 - this.x2) * (this.x3 - this.x2) + (this.y3 - this.y2) * (this.y3 - this.y2) + (this.z3 - this.z2) * (this.z3 - this.z2));;
		this.c = Math.sqrt((this.x1 - this.x3) * (this.x1 - this.x3) + (this.y1 - this.y3) * (this.y1 - this.y3) + (this.z1 - this.z3) * (this.z1 - this.z3));;

		this.cos = (this.a * this.a - this.b * this.b + this.c * this.c) / (2 * this.a * this.c);
		this.sin = Math.sqrt(1 - this.cos * this.cos);

		this.texCoords = [
			0, 0,
			this.a, 0,
			this.c * this.cos, this.c * this.sin
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the triangle
	 * @param {real} length_s - texture scale factor in s axis
	 * @param {real} length_t - texture scale factor in t axis
	 */
	updateTexCoords(length_s, length_t) {
		this.texCoords = [
			0, 0,
			this.a / length_s, 0,
			this.c * this.cos / length_s, this.c * this.sin / length_t
		];
		this.updateTexCoordsGLBuffers();
	}
}

