
lineProcessor = require("./lineProcessor")

/*
Base Node Class ===============================================================
*/

class BaseNode{

    constructor(line, document){
        this.document = document;
        this.lines = [line,];
        this.processedLines = [];
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

    processContent(){
        for (let line of this.lines){
            this.processedLines.push(this.processLine(line));
        }
    }

    stripLine(line){
        /*
        Strips a line of text of any characters marking line node type.

        This should essentially return a line content, without any line node related markings.
        */
        return line;
    }

    processLine(line){
        let content = this.stripLine(line);
        return lineProcessor.processLine(content);
    }

    getText(){
        let txt = "";
        for (let processedLine of this.processedLines){
            txt += processedLine.getText();
        }
        return txt;
    }
}

/*
Node Classes ==================================================================
*/

class CodeNode extends BaseNode{
    static isStartLine(line){
        return line.startsWith('```');
    }

    canIncludeLine(line){
        return this.lines.length === 1 || this.lines.length > 1 && this.lines[this.lines.length-1].trim() != "```";
    }

    processContent(){
        for (let idx = 1; idx < this.lines.length - 2; idx++){
            this.processedLines.push(this.processLine(this.lines[idx]));
        }
    }
}

class CommentNode extends BaseNode{
    static isStartLine(line){
        return line.startsWith('//');
    }

    canIncludeLine(line){
        return CommentNode.isStartLine(line);
    }

    processLine(line){
        // comment lines don't need processing - no enumerations are done here
        // TODO: consider using comments for defining variables in a transparent way
        return lineProcessor.getUnprocessedLine(line);
    }

    getText(){
        return ""
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

    processContent(){/* Nothing to do here */}

    getText(){
        return ""
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

    stripLine(line){
        return line.replace(/^\^+ */, "");
    }
}

class ListNode extends BaseNode{

    static isStartLine(line){
        return Boolean(line.match(/^(\s+)-/));
    }

    canIncludeLine(line){
        return ListNode.isStartLine(line);
    }

    stripLine(line){
        return line.replace(/^(\s+)-(\s+)?/, "");
    }
}

class ParagraphNode extends BaseNode{

    static isStartLine(line){
        return true;
    }

    canIncludeLine(line){
        return false;
    }

    addLine(line){
        throw Error('NotAllowed: adding lines to paragraph nodes is not allowed.');
    }
}

/*
Export ========================================================================
*/

module.exports.DefaultNodeTypes = [
    CodeNode,
    CommentNode,
    EmptyLineNode,
    HeaderNode,
    ListNode,
];
module.exports.ParagraphNode = ParagraphNode;
