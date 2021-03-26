/*
Base Node Class ===============================================================
*/

class BaseNode{

    constructor(line){
        this.lines = [line,];
    }

    static isStartLine(line){
        return false;
    }

    canIncludeLine(line){
        return false;
    }

    addLine(line){
        this.lines.push(line);
    }
}

/*
Node Classes ==================================================================
*/

class CommentNode extends BaseNode{
    static isStartLine(line){
        return line.startsWith('//');
    }

    canIncludeLine(line){
        return CommentNode.isStartLine(line);
    }
}

class EmptyLineNode extends BaseNode{

    constructor(line){
        super();
        this.lines = null;
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

class HeaderNode extends BaseNode{

    constructor(line){
        super(line);
        // determine header degree
        this.degree = line.match(/^\^+/)[0].length;
    }

    static isStartLine(line){
        return line.startsWith('^');
    }

    addLine(line){
        throw Error('NotAllowed: adding lines to header nodes is not allowed.');
    }
}

/*
Document Class ================================================================
*/

NODE_CLASSES = [
    CommentNode,
    EmptyLineNode,
    HeaderNode,
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
