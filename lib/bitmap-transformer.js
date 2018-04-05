const BitmapHeader = require('./bitmap-header');

module.exports = class BitmapTransformer {
    constructor(buffer) {
        this.buffer = buffer;
        this.header = new BitmapHeader(buffer);
    }

    transform(fn) {
        for(let i = this.header.pixelOffset; i < this.header.fileSize; i += 3) {
            const colorObject = {};
            colorObject.b = this.buffer.readUInt8(i);
            colorObject.g = this.buffer.readUInt8(i + 1);
            colorObject.r = this.buffer.readUInt8(i + 2);
            const transformedColorObject = fn(colorObject);
            this.buffer.writeUInt8(transformedColorObject.b, i);
            this.buffer.writeUInt8(transformedColorObject.g, i + 1);
            this.buffer.writeUInt8(transformedColorObject.r, i + 2);
        }

        // this is a guide to what needs to happen
        // not a recipe

        // find the right place in the buffer that you to loop 
        // and start:
        // 1. reading pixel
        // 2. passing to fn
        // 3. write pixel back to buffer

        // you have access to:
        // this.buffer
        // this.header.bitsPerPixel

        // there is a buffer.slice

        // control your javascript loop 
        // (you can "step" by something other than 1)
    }
};

