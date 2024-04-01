#include <fog_pars_fragment>
varying float vElevation;

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

uniform float uColorOffset;
uniform float uColorMultiplier;

void main() {
    vec3 mixColor = mix(uDepthColor, uSurfaceColor, (vElevation + uColorOffset) * uColorMultiplier);

    gl_FragColor = vec4(mixColor, 1.0);

    //This will improve the colors of the output
    //Three.js WebGLRenderer requires us to output color in the right color space (by default sRGB)
    //Don't use it, cause I don't like the result colors
    //#include <colorspace_fragment>

    #include <fog_fragment>

}