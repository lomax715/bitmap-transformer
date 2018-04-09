const assert = require('assert');
const constants = require('../lib/bitmap-constants');
const bitmapHeader = require('../lib/bitmap-header');

describe('bitmap header', () => {

    it('has correct specs', () => {
        assert.ok(constants.PIXEL_OFFSET);
        assert.ok(constants.BITS_PER_PIXEL_OFFSET);
        assert.ok(constants.FILE_SIZE_OFFSET);
    });

    it('parses header data', () => {
        return bitmapHeader('./test/sunrise.bmp')
            .then(header => {
                assert.equal(header.pixelOffset, 54);
                assert.equal(header.bitsPerPixel, 24);
                assert.equal(header.fileSize, 1680056);
            });
    });
});