
nodesModule = require('./nodeTypes')

class TxtEdDocument{

    constructor(){
        this.nodeClasses = [];
        this.nodes = [];
    }

    // ========================================================================
    // Managing Configuration =================================================
    // ========================================================================

    setNodeTypes(nodeTypes){
        this.nodeClasses = nodeTypes;
    }

    addNodeType(nodeType){
        this.nodeClasses.push(nodeType);
    }

    // ========================================================================
    // Processing Input =======================================================
    // ========================================================================

    processText(text){
        /*
            Processes given text, to produce a Document object.
        */
        this.nodes = this.splitTextToNodes(text);
    }

    // Generating Nodes ===============

    newNodeFromLine(line){
        for (let nodeClass of this.nodeClasses){
            if (nodeClass.isStartLine(line)){
                return new nodeClass(line);
            }
        }
        return new nodesModule.ParagraphNode(line);  // Paragraph node accepts all lines, so is handled differently.
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
                nodes.push(this.newNodeFromLine(line));
                continue;
            }

            let lastNode = nodes[nodes.length-1];
            if (lastNode.canIncludeLine(line)){
                lastNode.addLine(line);
            } else {
                nodes.push(this.newNodeFromLine(line))
            }
        }

        return nodes
    }

    // ========================================================================
    // Generating Output ======================================================
    // ========================================================================

    getText(){
        /*
            Returns document text, after substitutions, enumerations, escaping... done.
        */
        console.log(this.nodes[0])
        console.log(this.nodes[1])
        console.log(this.nodes[2])
        console.log(this.nodes[3])
        console.log(this.nodes[4])
        console.log(this.nodes[this.nodes.length - 2])
        return ""
    }

    convertToHTML(){
        /*
            Returns document in html format.
        */
        return ""
    }
}

function getDocument(txt){
    // init
    let txtEdDoc = new TxtEdDocument();
    // configuration
    txtEdDoc.setNodeTypes(nodesModule.DefaultNodeTypes);
    // text processing
    console.log(txtEdDoc.nodeClasses)
    txtEdDoc.processText(txt);
    return txtEdDoc;
}

module.exports.getDocument = getDocument;
module.exports.BaseNode = nodesModule.BaseNode;
