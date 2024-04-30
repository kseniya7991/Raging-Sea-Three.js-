#define OCTAVES   		1		// 7
#define SWITCH_TIME 	5.0		// seconds
#define PI 3.14159
#include <fog_pars_vertex>
uniform float uTime;
uniform float uNoiseTime;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesElevation;
uniform float uBigWavesSpeed;

uniform float uSmallWavesCount;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesElevation;
uniform float uSmallWavesSpeed;

varying float vElevation;

varying vec2 vUv;

#include ../../../../../shaders/includes/perlinClassic3D.glsl

void main() {
    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>

    vec3 newPosition = vec3(position.x, position.y, position.z);

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
        sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) * uBigWavesElevation;

    //change to += to invert negative values to positive
    //smooth boobbles effect 
    for(float i = 1.0; i <= uSmallWavesCount; i++) {
        elevation -= abs(cnoise3(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vElevation = elevation;
    vUv = uv;
}
