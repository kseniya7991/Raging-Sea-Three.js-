#define OCTAVES   		1		// 7
#define SWITCH_TIME 	5.0		// seconds
#define PI 3.14159
#include <fog_pars_vertex>
uniform float uTime;
uniform float uNoiseTime;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesElevation;
uniform float uBigWavesSpeed;

uniform float uShift;

uniform float uSmallWavesCount;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesElevation;
uniform float uSmallWavesSpeed;

uniform float uVolume;

varying float vElevation;
varying vec3 vNormal;
varying vec3 vPosition;

varying vec2 vUv;

#include ../../../../../shaders/includes/perlinClassic3D.glsl

float calcElevation(vec3 position) {
    float elevation = sin(position.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
        sin(position.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) * uBigWavesElevation;

    //change to += to invert negative values to positive
    //smooth boobbles effect 
    for(float i = 1.0; i <= uSmallWavesCount; i++) {
        elevation -= abs(cnoise3(vec3(position.xz * uSmallWavesFrequency * i, uTime * (uSmallWavesSpeed))) * (uSmallWavesElevation) / i);
    }

    return elevation;
}

void main() {
    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>

    // Base position
    vec3 newPosition = vec3(position.x, position.y, position.z);
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    //Calc neighbor position
    float neighborShift = uShift;

    vec3 neighborA = modelPosition.xyz;
    neighborA.x += neighborShift;

    vec3 neighborB = modelPosition.xyz;
    neighborB.z -= neighborShift;

    // Elevation
    float elevation = calcElevation(modelPosition.xyz);
    modelPosition.y += elevation;

    //Calc neighbor elevation
    neighborA.y += calcElevation(neighborA);
    neighborB.y += calcElevation(neighborB);

    //Calc normal
    vec3 toA = normalize(neighborA - modelPosition.xyz);
    vec3 toB = normalize(neighborB - modelPosition.xyz);
    vec3 computedNormal = cross(toA, toB);

    // Final position
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    //Varyings
    vElevation = elevation;
    vPosition = modelPosition.xyz;
    vNormal = computedNormal;
    vUv = uv;
}
