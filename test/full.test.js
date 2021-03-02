fs = require('fs');
path = require('path');

converter = require(path.resolve(__dirname, '..', 'src', 'converter.js'))


test('very general conversion to HTML', () => {
    let sampleInput = fs.readFileSync(path.resolve(__dirname, 'sample_input'), 'utf8');
    let expectedOutput = fs.readFileSync(path.resolve(__dirname, 'expected_output.html'), 'utf8');
    let output = converter.convertToHTML(sampleInput);
    fs.writeFileSync(path.resolve(__dirname, 'output.html'), output);
    expect(output).toBe(expectedOutput);
});
