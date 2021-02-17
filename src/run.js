fs = require('fs');
path = require('path')
converter = require('./converter.js')

data = fs.readFileSync('sample_input', 'utf8')

fs.writeFileSync('output.html', converter.convert(data))
