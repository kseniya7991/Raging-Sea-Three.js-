vec3 pointLight(vec3 lightColor, float lightIntensity, vec3 normal, vec3 lightPosition, vec3 viewDirection, float specularPower, vec3 position, float decay) {

    vec3 lightDelta = lightPosition - position;
    float lightDistance = length(lightDelta);

    vec3 lightDirection = normalize(lightPosition);
    vec3 lightReflection = reflect(-lightDirection, normal);

    //Shading
    float shading = dot(normal, lightDirection);
    shading = max(0.0, shading);

    //Specular
    float specular = -dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = power10(specular, specularPower);

    // Decay
    float decayResult = 1.0 - lightDistance * decay;
    decayResult = max(0.0, decayResult);

    return lightColor * lightIntensity * decayResult * (shading + specular);
}
