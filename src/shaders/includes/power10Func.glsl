float power10(float powerNumber, float exponent) {
    if(powerNumber >= 10.0) {
        return pow(powerNumber, 9.0) * pow(powerNumber, exponent);
    } else {
        return pow(powerNumber, exponent);
    }
}