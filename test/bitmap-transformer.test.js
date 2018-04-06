const assert = require('assert');
const { promisify } = require('util');
const unlink = promisify(require('fs').unlink);
const fs = require('fs');
const BitmapTransformer = require('../lib/bitmap-transformer');
const invert = require('../lib/invert-transformer');

describe('bitmap file transformer', () => {

    const readFile = file => (fs.readFileSync(file));

    const invertedFile = './test/inverted-bitmap.bmp';
    
    before(() => {
        return unlink(invertedFile)
            .catch(err => {
                if(err.code !== 'ENOENT') throw err;
            }); 
    });

    let transformer = null;
    before(() => {
        transformer = BitmapTransformer.create('./test/test-bitmap.bmp');
    });

    it('test whole transform', () => {
        return transformer.transform(invert, invertedFile)
            .then(() => {
                const actual = readFile(invertedFile);
                const expected = readFile('./test/inverted-expected.bmp');
                assert.deepEqual(actual, expected);
            });

        // if you don't have a "expected" file yet, you could write it 
        // out by commenting above code, using code below, and visually inspect
        // the file for correctness.
        // return fs.writeFileSync('./test/output.bmp', bitmap.buffer);
    });
});