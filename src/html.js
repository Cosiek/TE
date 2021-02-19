
function formatCleanUp(text){
    // get rid of caret return
    text = text.replace(/\r/, '');
    // TODO: convert tabs to spaces
    // get rid of multiple (more then two) newlines
    text = text.replace(/\n\s+\n/, '\n\n');
    return text;
}


function getLineIndentLevel(line){
    return line.match(/^\s+/) ? line.match(/^\s+/)[0].length : 0;
}


function isEmptyString(line){
    return line.trim().length === 0;
}


class HTMLTag{

    constructor(line){
        this.lines = [line,];
    }

    canIncludeLine(line){
        throw Error('NotImplementedError');
    }

    handleEmptyLine(){
        // by default do nothing
    }

    addLine(line){
        this.lines.push(line);
    }

    getHTML(){
        throw NotImplementedError;
    }

    static isStartLine (line){
        throw NotImplementedError;
    }
}


class HTMLTagH extends HTMLTag{

    constructor(line){
        super(line);
        // determine h degree
        this.degree = line.match(/^\^+/)[0].length;
    }

    static isStartLine (line){
        return line.startsWith('^');
    }

    canIncludeLine(line){
        // TODO: I don't support multi-line h tags (for now)
        return false;
    }

    addLine(line){
        throw NotImplementedError;
    }

    getText(){
        return this.lines[0].replace(/^\^+/, "").trim();
    }

    getHTML(){
        return `<h${this.degree}>${this.getText()}</h${this.degree}>\n`;
    }
}


class HTMLTagP extends HTMLTag{

    static isStartLine (line){
        // p tags accept
        for (HTMLTagClass of CLASSES){
            if (HTMLTagClass === HTMLTagP){
                return true;
            } else if (HTMLTagClass.isStartLine(line)){
                return false;
            }
        }
        return true;
    }

    canIncludeLine(line){
        return false;
    }

    getText(){
        return this.lines[0].trim();
    }

    getHTML(){
        return `<p>\n\t${this.getText()}\n</p>\n`;
    }
}


class HTMLTagOl extends HTMLTag{

    constructor(line){
        super(line);

        this.indentLevel = getLineIndentLevel(line);
        this.children = [];
        this.addLine(line);
    }

    static isStartLine(line){
        return line.match(/^(\s+)-/);
    }

    handleEmptyLine(){
        this.children[this.children.length-1].handleEmptyLine();
    }

    canIncludeLine(line){
        return getLineIndentLevel(line) >= this.indentLevel;
    }

    addLine(line){
        if (this.children.length && this.children[this.children.length-1].canIncludeLine(line)){
            this.children[this.children.length-1].addLine(line);
        } else {
            this.children.push(new HTMLTagLi(line));
        }
    }

    getInnerHtml(){
        let html = "";
        for (let tag of this.children){
            html += tag.getHTML();
        }
        return html.trim();
    }

    getHTML(){
        return `<ol>\n\t${this.getInnerHtml()}\n</ol>\n`;
    }
}


class HTMLTagLi extends HTMLTag{

    constructor(line){
        super(line);

        this.indentLevel = getLineIndentLevel(line);
        this.children = [];

        this.addInitialP(line);
    }

    addInitialP(line){
        let lineText = line.match(/^\s*-(.*)/)[1].trim();
        if (lineText.length){
            this.children.push(new HTMLTagP(lineText));
        }
    }

    canIncludeLine(line){
        return (getLineIndentLevel(line) > this.indentLevel ||
                getLineIndentLevel(line) === this.indentLevel && !Boolean(line.match(/^\s+-/)))
    }

    handleEmptyLine(){
        this.children[this.children.length-1].handleEmptyLine();
    }

    addLine(line){
        if (this.children.length && this.children[this.children.length-1].canIncludeLine(line)){
            this.children[this.children.length-1].addLine(line);
        } else {
            this.children.push(newTagFromLine(line));
        }
    }

    getInnerHtml(){
        let html = "";
        // if the only child is tet, then skip inner html and treat text as direct part of li
        if (this.children.length === 1 && this.children[this.children.length - 1] instanceof HTMLTagP){
            return this.children[this.children.length - 1].getText();
        } else {
            for (let tag of this.children){
                html += tag.getHTML();
            }
        }
        return html.trim();
    }

    getHTML(){
        return `<li>\n\t${this.getInnerHtml()}\n</li>\n`;
    }

}


const CLASSES = [
    HTMLTagH,
    HTMLTagOl,
    HTMLTagP,  // keep p tag at the bottom
];


function newTagFromLine(line){
    for (HTMLTagClass of CLASSES){
        if (HTMLTagClass.isStartLine(line)){
            return new HTMLTagClass(line);
        }
    }
}


function convertToHTML(text){
    // build data structures (tags)
    text = formatCleanUp(text);
    let tags = [];
    let lines = text.split('\n');
    let i = 0;
    while (i < lines.length){
        let line = lines[i];
        if (line.startsWith('//')){
            // this line is a comment - ignore it
            i += 1;
            continue;
        } else if (tags.length){
            let lastTag = tags[tags.length-1];
            if (isEmptyString(line)){
                lastTag.handleEmptyLine();
                i += 1;
                continue;
            } else if (lastTag.canIncludeLine(line)){
                lastTag.addLine(line);
                i += 1;
                continue;
            }
        }
        // TODO: empty lines
        let tag = newTagFromLine(line);
        tags.push(tag);
        i += 1;
    }

    // convert tags to HTML
    html = "";
    for (tag of tags){
        html += tag.getHTML();
    }

    return html
}

module.exports.convertToHTML = convertToHTML;
