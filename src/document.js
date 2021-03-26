
class MarkItDocument{
    constructor(text){
        this.paragraphs = this.processText(text);
    }

    processText(text){
        /*
        Processes given text, to produce a Document object.
        */
        let paragraphs = this.splitTextToParagraphs(text);
        return paragraphs;
    }
    splitTextToParagraphs(text){
        /*
        Converts given text to a list of objects representing paragraphs / headers / list / so on.
        */
        let paragraphs = []
        // brake the text into lines
        for (let ln of text.split("\n")){
            // group lines into paragraphs / headers / list / ...
            console.log(ln)
        }

        return paragraphs
    }


}

module.exports.MarkItDocument = MarkItDocument;
