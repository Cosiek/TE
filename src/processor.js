
mIDocument = require('./document')

function getDocument(text){
    /*
    Processes given text, to produce a Document object.
    */
    return new mIDocument.MarkItDocument(text);
}


module.exports.getDocument = getDocument;