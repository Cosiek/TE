
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
        while (i <= this.line.length - 1 || buffer.length){
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

    getText(){
        let txt = "";
        for (let node of this.nodes){
            txt += node.getText();
        }
        return txt;
    }
}

/*
Base Inline Node Class ========================================================
*/

class InlineNode{

    constructor(){
        this.isOpen = true;  // is it useful?
        this.nodes = [];
        this.originalStr = "";
    }

    addToOriginalString(str){
        this.originalStr += str;
    }

    addToStr(str){
        // check if last node is a string
        if (typeof(this.nodes[this.nodes.length-1]) !== "string"){
            this.nodes.push("");
        }

        let i = 0;
        while (i < str.length){
            this.nodes[this.nodes.length-1] += str[i];
            i++;
        }
    }

    addNode(node){
        this.addToOriginalString(node.originalStr);
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
        let char = buffer.shift();
        this.addToOriginalString(char);
        // handle escaping
        if (char === "\\"){
            char = buffer.shift();
            this.addToOriginalString(char);
        }
        this.addToStr(char);
    }

    close(){ this.isOpen = false }

    acceptsAsChild(node){
        // TODO: NotImplementedError
    }

    getVariables(){
        /*
            Returns a list of any variable ocurance in this node or sub nodes.

            This includes both variables used and defined here.

            Variables from nested nodes should be returned first.
        */
        let variables = [];
        // get from sub-nodes
        for (let node of this.nodes){
            // skip basic text noes
            if (node.getVariables === undefined){
                continue
            }
            console.log(">>> >> > ", node)
            for (let variable of node.getVariables()){
                variables.push(variable);
            }
        }
        // get own variables
        for (let variable of this.getOwnVariables()){
            variables.push(variable);
        }

        return variables
    }

    getOwnVariables(){
        return [];
    }

    getText(){
        let txt = "";
        for (let node of this.nodes){
            if (node.getVariables === undefined){
                // simple string - not a node
                txt += node;
            } else {
                // a true node that needs processing
                txt += node.getText();
            }
        }
        return txt
    }
}

/*
Variable class ================================================================
*/

class VariableManager{
    constructor(idString){
        this.idString = idString;

        this.initialValue = 1;
        this.variables = []
    }

    addVariable(variable){
        this.variables.push(variable);
    }
}

class Variable{
    constructor(idString, setValue){
        this.idString = idString;  // TODO: required
        if (setValue == undefined){
            setValue = null;
        }
        this.setValue = setValue;     // defaults to null
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

    // variables handling

    getOwnVariables(){
        let idString = this.originalStr;
        let value = null;
        let variable = new Variable(idString, value);
        return [variable,];
    }
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

function getUnprocessedLine(lineTxt){
    /*
    Returns a new line object, that includes given text, but doesn't process it.

    Useful when you don't really want the line to be processed - like comment lines
    */
    return new Line(lineTxt);
}

module.exports.processLine = processLine;
module.exports.getUnprocessedLine = getUnprocessedLine;
module.exports.VariableManager = VariableManager;
