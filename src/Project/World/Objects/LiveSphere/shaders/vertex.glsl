#define PI 3.14159
#include <fog_pars_vertex>
uniform float uTime;
uniform vec2 uBigWavesFrequency;
uniform float uBigWavesElevation;
uniform float uBigWavesSpeed;

uniform float uSmallWavesFrequency;
uniform float uSmallWavesElevation;
uniform float uSmallWavesSpeed;

varying float vElevation;

varying vec2 vUv;

#include ../../../../../shaders/includes/perlinClassic4D.glsl

void main() {
    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>

    vec3 newPosition = vec3(position.x, position.y, position.z);

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);

    float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
        sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) * uBigWavesElevation;

    float waveFrequency = uSmallWavesFrequency * 2.0;
    vec3 wavePosition = normalize(modelPosition.xyz) * waveFrequency;
    elevation -= smoothstep(0.0, 1.2, abs(cnoise4(vec4(wavePosition.xyz, uTime * uSmallWavesSpeed)) * uSmallWavesElevation));

    modelPosition.xyz *= 1.0 + elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vElevation = elevation;
    vUv = uv;
}
