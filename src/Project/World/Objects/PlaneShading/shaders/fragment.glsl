#include <fog_pars_fragment>
varying float vElevation;

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

uniform float uColorOffset;
uniform float uColorMultiplier;

uniform bool uPointLight;
uniform vec3 uPointLightPos;
uniform float uPointLightSpecularPower;
uniform float uPointLightIntensity;
uniform float uPointLightDecay;

uniform bool uDirectionalLight;
uniform vec3 uDirectionalLightPos;
uniform float uDirectionalLightIntensity;
uniform float uDirectionalLightSpecularPower;

uniform float uTime;

uniform float uVolume;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

#include ../../../../../shaders/lights/directionalLight.glsl
#include ../../../../../shaders/lights/pointLight.glsl

void main() {
    //Base color
    vec3 mixColor = mix(uDepthColor, uSurfaceColor, (vElevation + uColorOffset) * uColorMultiplier);
    vec3 finalColor = smoothstep(0.0, 1.0, mixColor);

    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    vec3 light = vec3(0.0);

    if(uPointLight)
        light += pointLight(vec3(1.0), uPointLightIntensity, normal, uPointLightPos, viewDirection, uPointLightSpecularPower, vPosition, uPointLightDecay);

    if(uDirectionalLight)
        light += diractionalLight(vec3(1.0), uDirectionalLightIntensity, normal, uDirectionalLightPos, viewDirection, uDirectionalLightSpecularPower);

    finalColor *= light;

    //add brightness to deptColor
    finalColor = mix(finalColor, finalColor * 15.0, smoothstep(0.0, 0.9, abs(vElevation)));

    //Final Color
    gl_FragColor = vec4(finalColor, 1.0);

    //This will improve the colors of the output
    //Three.js WebGLRenderer requires us to output color in the right color space (by default sRGB)
    //Don't use it, cause I don't like the result colors
    // #include <colorspace_fragment>

    #include <fog_fragment>
   #include <tonemapping_fragment>
}