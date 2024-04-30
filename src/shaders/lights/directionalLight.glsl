
#include ../includes/power10Func.glsl;

vec3 diractionalLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower) {

    vec3 lightDirection = normalize(lightPosition);
    vec3 lightReflection = reflect(-lightDirection, normal);

    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading);

    //Specular
    float specular = -dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = power10(specular, specularPower);

    return lightColor * lightIntensity * (shading + specular);
}
