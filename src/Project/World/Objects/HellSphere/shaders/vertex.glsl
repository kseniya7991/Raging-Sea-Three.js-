#define OCTAVES   		1		// 7
#define SWITCH_TIME 	1.0		// seconds
#define PI 3.1415926535897932384626433832795
#include <fog_pars_vertex>
uniform float uTime;
uniform vec3 uBigWavesFrequency;
uniform float uBigWavesElevation;
uniform float uBigWavesSpeed;

uniform float uSmallWavesFrequency;
uniform float uSmallWavesElevation;
uniform float uSmallWavesSpeed;
uniform float uSmallWavesCount;

varying float vElevation;

varying vec2 vUv;
#include ../../../../../shaders/includes/perlinClassic4D.glsl

void main() {
    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>

    vec3 newPosition = vec3(position.x, position.y, position.z);

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    vec3 wavePosition = normalize(modelPosition.xyz);
    float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
        sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) * uBigWavesElevation;

    for(float i = 1.0; i <= uSmallWavesCount; i++) {
        elevation -= abs(cnoise4(vec4(wavePosition.xyz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }

    modelPosition.xyz *= 1.0 + elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vElevation = elevation;
    vUv = uv;
}
