/*
Node Classes ==================================================================
*/

class EmptyLineNode{
    constructor(line){
        this.count = 1;
    }

    static isStartLine(line){
        return line.trim().length === 0;
    }

    canIncludeLine(line){
        return EmptyLineNode.isStartLine(line);
    }

    addLine(line){
        this.count++;
    }
}

/*
Document Class ================================================================
*/

NODE_CLASSES = [
    EmptyLineNode,
]

function newNodeFromLine(line){
    for (nodeClass of NODE_CLASSES){
        if (nodeClass.isStartLine(line)){
            return new nodeClass(line);
        }
    }
}

class MarkItDocument{
    constructor(text){
        this.nodes = this.processText(text);
    }

    processText(text){
        /*
        Processes given text, to produce a Document object.
        */
        let nodes = this.splitTextToNodes(text);
        return nodes;
    }

    splitTextToNodes(text){
        /*
        Converts given text to a list of objects representing paragraphs / headers / list / so on.
        */
        let nodes = [];
        // brake the text into lines
        for (let line of text.split("\n")){
            // group lines into nodes (paragraphs / headers / list / ...)
            if (nodes.length === 0){
                let newNode = newNodeFromLine(line);
                if (newNode !== undefined){
                    nodes.push(newNode);
                }continue;
            }

            let lastNode = nodes[nodes.length-1];
            if (lastNode.canIncludeLine(line)){
                lastNode.addLine(line);
            } else {
                let newNode = newNodeFromLine(line);
                if (newNode !== undefined){
                    nodes.push(newNode);
                }
            }
        }

        return nodes
    }


}

module.exports.MarkItDocument = MarkItDocument;
