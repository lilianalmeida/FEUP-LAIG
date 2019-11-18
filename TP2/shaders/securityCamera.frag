#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform float timeFactor;
uniform sampler2D uSampler;


void main() {
	vec4 filter = texture2D(uSampler, vTextureCoord);
	float ratio = sqrt(pow(0.5 - vTextureCoord[0],2.0) + pow(0.5 - vTextureCoord[1],2.0));
	filter.r *= (1.0 - ratio);
	filter.g *= (1.0 - ratio);
	filter.b *= (1.0 - ratio);
	
	
	if(mod((vTextureCoord.y + timeFactor/100.0) * 18.0 , 1.1) > 1.0){
		filter.r *= 1.5;
		filter.g *= 1.5;
		filter.b *= 1.5;
	}

	

	filter[3] = 1.0;
	gl_FragColor = filter;
		//gl_FragColor =  texture2D(uSampler, vTextureCoord);
		//gl_FragColor = vec4(uSampler * vTextureCoord.x, 1.0);
}