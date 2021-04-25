
/*
Line Object Class =============================================================
*/

class Line{
    constructor(line){
        this.line = line;
        this.nodes = [];
    }

    parse(){
        let nodeStack = [];
        let buffer = [];
        let i = 0;
        while (i <= this.line.length - 1){
            // fill buffer
            while (!this._isBufferFilled(buffer) && i <= this.line.length - 1){
                // add char to buffer
                buffer.push(this.line[i]);
                i++;
            }

            // iterate nodes in stack in reverse order
            let stuffGotClosed = false;
            for (let j = nodeStack.length - 1; j >= 0; j--){
                if (nodeStack[j].constructor.isThisTheEnd(buffer)){
                    // close all nodes above this one, add them to parent nodes
                    for (let k = nodeStack.length - 1; k > j; k--){
                        nodeStack[k].close();
                        nodeStack[k-1].addNode(nodeStack.pop());
                    }
                    // take chars from buffer
                    nodeStack[j].consumeEnding(buffer);
                    // close last node
                    nodeStack[j].close();
                    // add node to its parent
                    if (j === 0){
                        this.addNode(nodeStack.pop());
                    } else {
                        nodeStack[j-1].addNode(nodeStack.pop());
                    }
                    // break loop
                    stuffGotClosed = true;
                    break;
                }
            }

            // if no nodes ware closed
            if (!stuffGotClosed){
                let newNodeClass = getNodeClassForBuffer(buffer);
                let lastNode = nodeStack[nodeStack.length - 1];
                // check if new node should be created
                if (nodeStack.length === 0){  // there is a need for new node (no matter what it is)
                    // create new node
                    let newNode = new newNodeClass();
                    newNode.consumeBeginning(buffer);
                    // add new node to stack
                    nodeStack.push(newNode);
                } else if (newNodeClass !== TextNode){  // there is a need for new non-plain-text node
                    // create new node
                    let newNode = new newNodeClass();
                    newNode.consumeBeginning(buffer);
                    // check if new node should be added to last node
                    if (newNodeClass !== TextNode && !lastNode.acceptsAsChild(newNode)){
                        // close last node
                        lastNode.close();
                        // append last node to its parent
                        if (nodeStack.length === 1){
                            this.addNode(nodeStack.pop());
                        } else {
                            nodeStack[nodeStack.length - 1].addNode(nodeStack.pop());
                        }
                    }
                    // add new node to stack
                    nodeStack.push(newNode);
                } else {
                    lastNode.processBuffer(buffer);
                }
            }
        }
        // close and add all remaining nodes
        for (let k = nodeStack.length - 1; k >= 0; k--){
            nodeStack[k].close();
            if (k > 0){
                nodeStack[k-1].addNode(nodeStack.pop());
            } else {
                this.addNode(nodeStack[0]);
            }
        }
    }

    _isBufferFilled(buffer){
        /*
            Helper function for parsing - checks if buffer has enough chars.
        */
        let counter = 0
        for (let letter of buffer){
            if (letter !== "\\"){ counter++ }
        }
        return counter >= 2;
    }

    addNode(node){
        this.nodes.push(node);
    }
}

/*
Base Inline Node Class ========================================================
*/

class InlineNode{

    constructor(){
        this.isOpen = true;  // is it useful?
        this.nodes = [];
        this.str = "";
    }

    addStr(buffer){
        // get rid of escape char
        if (buffer[0] === "\\"){
            buffer.shift();
        }
        // check of buffer isn't empty.
        if (buffer.length > 0){
            // add first buffer char to string
            this.str += buffer.shift();
        }
    }

    addNode(node){
        this.addToStr(node.str);
        this.nodes.push(node);
    }

    static isThisTheBeginning(buffer){
        // TODO: NotImplementedError
    }

    static isThisTheEnd(buffer){
        // TODO: NotImplementedError
    }

    consumeBeginning(buffer){
        // TODO: NotImplementedError
    }

    consumeEnding(buffer){
        // TODO: NotImplementedError
    }

    processBuffer(buffer){
        this.addToStr(buffer.shift())
    }

    close(){ this.isOpen = false }

    acceptsAsChild(node){
        // TODO: NotImplementedError
    }
}

/*
Inline Nodes Classes ==========================================================
*/

class EnumerationNode extends InlineNode{
    /*
    Node that substitutes numbers within its text for increasing enumeration.
    */

    static beginningStr = "{#"
    static endingStr = "#}"

    static isThisTheBeginning(buffer){
        return buffer[0] + buffer[1] === this.beginningStr;
    }

    static isThisTheEnd(buffer){
        return buffer[0] + buffer[1] === this.endingStr;
    }

    consumeBeginning(buffer){
        this.addToOriginalString(buffer.shift() + buffer.shift());
    }

    consumeEnding(buffer){
        this.addToOriginalString(buffer.shift() + buffer.shift())
    }

    acceptsAsChild(node){ return true } // TODO
}

class TextNode extends InlineNode{
    /*
    A node that just holds text, without any formatting.

    Doesn't support children nodes.
    */

    static isThisTheBeginning(buffer){ return true }

    static isThisTheEnd(buffer){ return false }

    consumeBeginning(buffer){
        // Text nodes are a special case, as they have no beginning, so simply process the first char
        this.processBuffer(buffer);
    }

    acceptsAsChild(node){ return false }
}

INLINE_NODE_TYPES = [
    EnumerationNode,
]

/*
Executions ====================================================================
*/

function getNodeClassForBuffer(buffer){
    /*
    Return a class of a node, if first chars of buffer indicate, that a new node should be created.
    */
    for (nodeType of INLINE_NODE_TYPES){
        if (nodeType.isThisTheBeginning(buffer)){
            return nodeType;
        }
    }
    // in case nothing matches, return a simple Text node.
    return TextNode;

}

function processLine(lineTxt){
    /*
    Converts a line of text into a line object, with a list of parsed inline nodes.

    Given line of text should be already stripped of any whitespace or prefixes, suffixes, that aren't really part
    of content.
    */
    let line = new Line(lineTxt);
    line.parse();

    return line;
}

module.exports.processLine = processLine;
