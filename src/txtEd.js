
nodesModule = require('./nodeTypes')
lineProcessor = require('./lineProcessor')

class TxtEdDocument{

    constructor(){
        this.nodeClasses = [];
        this.nodes = [];
        this.variables = {}
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
        // initialize counters and other variables
        for (let node of this.nodes){
            for (let line of node.processedLines){
                for (let inlineNode of line.nodes){
                    this.registerVariables(inlineNode.getVariables());
                }
            }
        }
    }

    registerVariables(variables){
        for (let variable of variables){
            if (this.variables[variable.idString] === undefined){
                this.variables[variable.idString] = new lineProcessor.VariableManager(variable.idString);
                this.variables[variable.idString].addVariable(variable);
            } else {
                this.variables[variable.idString].addVariable(variable);
            }
        }
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
        let txt = "";
        for (let node of this.nodes){
            txt += node.getText();
        }
        return txt;
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
    txtEdDoc.processText(txt);
    return txtEdDoc;
}

module.exports.getDocument = getDocument;
module.exports.BaseNode = nodesModule.BaseNode;
