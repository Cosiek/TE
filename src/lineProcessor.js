
/*
Line Object Class =============================================================
*/

class Line{
    constructor(line){
        this.line = line;
        this.nodes = [];
    }

    parse(){
        /*
        Generates a list of nodes form line of text.
        */
        let i = 0;
        let buffer = [];
        while (i < this.line.length){
            // fill buffer
            buffer.push(this.line[i]);
            i++;

            let lastNode = this.nodes[this.nodes.length - 1];
            if (this.nodes.length > 0 && lastNode.canProcessBuffer(buffer)){
                lastNode.processBuffer(buffer);
            } else {
                let nodeClass = getNodeClassForBuffer(buffer);
                lastNode = new nodeClass();
                this.nodes.push(lastNode);
            }

            lastNode.processBuffer(buffer);
        }
    }
}

/*
Base Inline Node Class ========================================================
*/

class InlineNode{

    constructor(){
        this.isOpen = true;
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

    isNewNodeBeginning(buffer){
        return false;
    }

    processBuffer(buffer){
        lastNode = this.nodes[this.nodes.length - 1];
        if (lastNode.isOpen){
            lastNode.processBuffer(buffer);
        } else {
            nodes.push(getNewNodeFromBuffer(buffer));
        }
    }
}

/*
Inline Nodes Classes ==========================================================
*/

class TextNode extends InlineNode{
    /*
    A node that just holds text, without any formatting.

    Closes if any other node starts.
    */

    canProcessBuffer(buffer){
        /*
        Return true only if no other node type would start from this buffer.
        */
        if (getNodeClassForBuffer(buffer) === TextNode){
            return true;
        }
        return false;
    }

    isNewNodeBeginning(buffer){
        /*
        Text nodes should accept anything.
        */
        return true;
    }

    processBuffer(buffer){
        this.addStr(buffer);
    }
}

INLINE_NODE_TYPES = [

]

/*
Executions ====================================================================
*/

function getNodeClassForBuffer(buffer){
    /*
    Return a class of a node, if first chars of buffer indicate, that a new node should be created.
    */
    for (nodeType of INLINE_NODE_TYPES){
        if (nodeType.isNewNodeBeginning(buffer)){
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
