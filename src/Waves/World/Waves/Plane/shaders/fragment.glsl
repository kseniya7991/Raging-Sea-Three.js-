#include <fog_pars_fragment>
varying float vElevation;

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

uniform float uColorOffset;
uniform float uColorMultiplier;

uniform vec3 uFoamColor;
uniform float uFoamOffset;
uniform float uFoamMultiplier;

uniform float uTime;

varying vec2 vUv;

void main() {
    // float pulseTwice = abs(sin(uTime));
    // vec3 newDepthColor = vec3(sin(uDepthColor.r * pulseTwice), uDepthColor.gb);
    vec3 newSurfaceColor = mix(uSurfaceColor, uFoamColor, smoothstep(0.0, 1.2, vElevation) * uFoamMultiplier);
    vec3 mixColor = mix(uDepthColor, newSurfaceColor, (vElevation + uColorOffset) * uColorMultiplier);

    gl_FragColor = vec4(mixColor, 1.0);

    //This will improve the colors of the output
    //Three.js WebGLRenderer requires us to output color in the right color space (by default sRGB)
    //Don't use it, cause I don't like the result colors
    //#include <colorspace_fragment>

    #include <fog_fragment>
}