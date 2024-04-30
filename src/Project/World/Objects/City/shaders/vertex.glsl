#define OCTAVES   		1		// 7
#define SWITCH_TIME 	5.0		// seconds
#define PI 3.14159
#include <fog_pars_vertex>

uniform float uSmallWavesCount;
uniform float uBuildingsElevation;
uniform float uBuildingsCount;

varying float vElevation;

varying vec2 vUv;

#include ../../../../../shaders/includes/voroNoise.glsl

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
