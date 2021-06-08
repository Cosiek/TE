fs = require('fs');
path = require('path');

txtEd = require(path.resolve(__dirname, '..', 'src', 'txtEd.js'))

test('Retrieve un-formatted text from document', () => {
    /*
        Checks if all substitution, enumeration, escaping mechanisms are in place.
    */
    let sampleInput = fs.readFileSync(path.resolve(__dirname, 'sample_input'), 'utf8');
    let expectedOutput = fs.readFileSync(path.resolve(__dirname, 'expected_output.txt'), 'utf8');
    let doc = txtEd.getDocument(sampleInput);
    let output = doc.getText();
    fs.writeFileSync(path.resolve(__dirname, 'output.txt'), output);
    //expect(output).toBe(expectedOutput);
});

test('General conversion to HTML', () => {
    let sampleInput = fs.readFileSync(path.resolve(__dirname, 'sample_input'), 'utf8');
    let expectedOutput = fs.readFileSync(path.resolve(__dirname, 'expected_output.html'), 'utf8');
    let doc = getDocument(sampleInput);
    let output = doc.convertToHTML();
    fs.writeFileSync(path.resolve(__dirname, 'output.html'), output);
    expect(output).toBe(expectedOutput);
});

test('Retrieve original input from document', () => {

});

test('Retrieve VCS ready text.', () => {

});
