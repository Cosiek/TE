fs = require('fs');
path = require('path');

converter = require(path.resolve(__dirname, '..', 'src', 'converter.js'))


test('very general conversion to HTML', () => {
    sampleInput = fs.readFileSync(path.resolve(__dirname, 'sample_input'), 'utf8');
    fs.writeFileSync(path.resolve(__dirname, 'output.html'), converter.convert(sampleInput));
    //expect(sum(1, 2)).toBe(3);
});
