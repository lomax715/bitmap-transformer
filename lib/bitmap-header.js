const constants = require('./bitmap-constants');
const readFrom = require('./read-from');

module.exports = function bitmapHeader(file) {
    return readFrom(file, constants.STOP_READING)
        .then(buffer => {
            return {
                pixelOffset: buffer.readUInt32LE(constants.PIXEL_OFFSET),
                bitsPerPixel: buffer.readUInt16LE(constants.BITS_PER_PIXEL_OFFSET),
                fileSize: buffer.readUInt32LE(constants.FILE_SIZE_OFFSET)
            };
        });
};