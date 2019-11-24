#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform float timeFactor;
uniform sampler2D uSampler;


void main() {
	vec4 filter = texture2D(uSampler, vTextureCoord);

	// Radial shading
	//float ratio = sqrt(pow(0.5 - vTextureCoord[0],2.0) + pow(0.5 - vTextureCoord[1],2.0));
	if (abs(0.5 - vTextureCoord[0]) > abs(0.5 - vTextureCoord[1])){
		filter *= (1.0 - abs(0.5 - vTextureCoord[0])*2.0);
	}else{
		filter *= (1.0 - abs(0.5 - vTextureCoord[1])*2.0);
	}
	
	// Animated white horizontal lines
	if(mod((vTextureCoord.y - timeFactor/100.0) * 18.0 , 1.1) > 1.0){
		filter *= 1.8;
	}
	filter[3] = 1.0;

	gl_FragColor = filter;
}