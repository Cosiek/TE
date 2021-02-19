
html = require('./html');
enumerations = require('./enumerations');
escapeHTML = require('./escapeHTML');
substitutions = require('./substitutions');


function convertToHTML(text){
    text = escapeHTML.escape(text);
    text = enumerations.substitute(text);
    text = substitutions.substitute(text);
    // TODO: get rid of escape signs "\" and \r
    return html.convertToHTML(text);
}

module.exports.convertToHTML = convertToHTML
