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

    processLine(line){
        return lineProcessor.process(line);
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
}

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

    processContent(){/* Nothing to do here */}
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

class ListNode extends BaseNode{

    static isStartLine(line){
        return Boolean(line.match(/^(\s+)-/));
    }

    canIncludeLine(line){
        return ListNode.isStartLine(line);
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
