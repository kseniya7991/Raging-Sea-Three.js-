#include <fog_pars_fragment>
varying float vElevation;

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

uniform float uColorOffset;
uniform float uColorMultiplier;

uniform float uTime;

varying vec2 vUv;

void main() {
    vec3 mixColor = mix(uDepthColor, uSurfaceColor, (vElevation + uColorOffset) * uColorMultiplier);
    if(vElevation < (-0.05) && vElevation > (-0.06)) {
        float strength = step(0.8, mod(vUv.x * 150.0 + uTime * 0.4, 1.3));
        strength *= step(0.8, mod(vUv.y * 150.0 + uTime * 0.4, 1.3));
        if(strength > 0.9 && vUv.y * vUv.x > 0.1 && vUv.y * vUv.x < 0.5) {
            mixColor.r = 1.0;
            mixColor.g = 0.8;
        }
    }

    if(vElevation < -0.08 && vElevation > -0.09) {
        float strength = step(0.8, mod(vUv.x * 150.0 + uTime * 0.2, 1.3));
        strength *= step(0.8, mod(vUv.y * 150.0 + uTime * 0.2, 1.3));
        if(strength > 0.9 && vUv.y - vUv.x < 0.1) {
            mixColor.r = 1.0;
            mixColor.g = 0.8;
        }
    }
    gl_FragColor = vec4(mixColor, 1.0);

    //This will improve the colors of the output
    //Three.js WebGLRenderer requires us to output color in the right color space (by default sRGB)
    //Don't use it, cause I don't like the result colors
    //#include <colorspace_fragment>

    #include <fog_fragment>
}