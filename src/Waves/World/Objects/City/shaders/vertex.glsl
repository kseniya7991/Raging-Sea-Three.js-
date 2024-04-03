#define OCTAVES   		1		// 7
#define SWITCH_TIME 	5.0		// seconds
#define PI 3.14159
#include <fog_pars_vertex>

uniform float uSmallWavesCount;
uniform float uBuildingsElevation;
uniform float uBuildingsCount;

varying float vElevation;

varying vec2 vUv;

vec3 hash3(vec2 p) {
    vec3 q = vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9)));
    return fract(sin(q) * 43758.5453);
}

float iqnoise(in vec2 x, float u, float v) {
    vec2 p = floor(x);
    vec2 f = fract(x);

    float k = 1.0 + 63.0 * pow(1.0 - v, 4.0);

    float va = 0.0;
    float wt = 0.0;
    for(int j = -2; j <= 2; j++) for(int i = -2; i <= 2; i++) {
            vec2 g = vec2(float(i), float(j));
            vec3 o = hash3(p + g) * vec3(u, u, 1.0);
            vec2 r = g - f + o.xy;
            float d = dot(r, r);
            float ww = pow(1.0 - smoothstep(0.0, 1.414, sqrt(d)), k);
            va += o.z * ww;
            wt += ww;
        }

    return va / wt;
}

void main() {
    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>

    vec3 newPosition = vec3(position.x, position.y, position.z);

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    float elevation = 0.0;
    elevation -= iqnoise(modelPosition.xz * uBuildingsCount, 0.0, 0.0) * uBuildingsElevation;

    if(elevation < -0.048 && elevation > -0.062) {
        elevation = -0.048;
    }

    if(elevation < -0.078 && elevation > -0.092) {
        elevation = -0.078;
    }

    modelPosition.y += max(elevation, -0.6);
    ;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vElevation = elevation;
    vUv = uv;
}
