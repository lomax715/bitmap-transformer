function invert(colorObject) {
    const invertedColorObject = {};
    invertedColorObject.r = 255 - colorObject.r;
    invertedColorObject.g = 255 - colorObject.g;
    invertedColorObject.b = 255 - colorObject.b;
    return invertedColorObject;
}

module.exports = invert;