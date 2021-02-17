
// HTML escaping ==============================================================

ESCAPES = {
    '&': "&amp;",
    '<': "&lt;",
    '"': "&quot;",
    "'": "&#039;",
}

function escapeHTML(text){
    return text.replace(/[&<"']/g, function(m){ return ESCAPES[m] })
}

// Enumerations ===============================================================

class EnumerationParser{
    regex = null;

    isPattern(pattern){
        let match = pattern.match(this.regex);
        return match !== null;
    }

    numberToStr(number){
        return number + "";
    }

    stdStrToNumber(str){
        return Number(str);
    }

    strToNumber(str){
        return this.stdStrToNumber(str);
    }

    getValue(pattern, number){
        // strip # chars from pattern
        pattern = pattern.substring(1, pattern.length-1);
        return pattern.replace(this.regex, this.numberToStr(number));
    }
}


class FloatEnumerationParser extends EnumerationParser{
    regex = /\d+([\.,])\d+/

    getValue(pattern, number){
        let separator = pattern.match(this.regex)[1];
        let numTxt = this.numberToStr(number).replace(/([\.,])/, separator);
        return pattern.replace(this.regex, numTxt);
    }
}


class IntEnumerationParser extends EnumerationParser{
    regex = /\d+/
}


class RomanEnumerationParser extends EnumerationParser{
    regex = /\b([IVXLCDM]+)\b/
    numbers = [
        ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90],
        ['L', 50], ['XL', 40], ['X' ,10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ]

    numberToStr(number){
        let roman = "";
        for (let nr of this.numbers) {
            while (number >= nr[1]) {
                roman += nr[0];
                number -= nr[1];
            }
        }
        return roman;
    }

    strToNumber(str){  // TODO: test
        const roman = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
        let number = 0;
        for (let i = 0; i < str.length; i++) {
            const curr = roman[str[i]];
            const next = roman[str[i + 1]];
            if (curr < next){
                (number -= curr);
            } else {
                (number += curr);
            }
        }
        return number;
    }
}


class LettersEnumerationParser extends EnumerationParser{
    regex = /\b([a-z])\b/
    alphabet = "abcdefghijklmnopqrstuwvxyz"

    numberToStr(number){
        // TODO: what about negative numbers
        // TODO: what about numbers outside of this range?
        return this.alphabet[number - 1];
    }

    strToNumber(str){
        // TODO: what about longer stings and chars that are not in alphabet
        return this.alphabet.indexOf(str) + 1;
    }
}


class CapitalLettersEnumerationParser extends EnumerationParser{
    regex = /\b([A-Z])\b/
    alphabet = "ABCDEFGHIJKLMNOPQRSTUWVXYZ"

    numberToStr(number){
        // TODO: what about negative numbers
        // TODO: what about numbers outside of this range?
        return this.alphabet[number - 1];
    }

    strToNumber(str){
        // TODO: what about longer stings and chars that are not in alphabet
        return this.alphabet.indexOf(str) + 1;
    }
}


const PARSERS = [
    new FloatEnumerationParser(),           // floating point number
    new IntEnumerationParser(),             // number
    new RomanEnumerationParser(),           // roman numbers
    new LettersEnumerationParser(),         // a-z
    new CapitalLettersEnumerationParser(),  // A-Z
]


class Enumeration{
    constructor(pattern){
        this.pattern = pattern;
        this.counter = 1;
        this.step = 1;
        this.parser = this.getParser(pattern);
    }

    isValid(){ return this.parser !== null }

    static clearPattern(dirtyPattern){
        // ^#\[(\d+(,\d+)?)(:(\d+(,\d+)?))?\]
        let m = dirtyPattern.match(/^#(\[.+\])?(.*)/);
        return [m[1], "#" + m[2]];
    }

    getParser(pattern){
        for (let parser of PARSERS){
            if (parser.isPattern(pattern)){
                return parser;
            }
        }
        return null;
    }

    applySettings(enumSettings){
        // enumSettings is a sting in the form of [start:step]
        let m = enumSettings.match(/\[([^:]*)?:?([^:]*)?\]/);
        if (m[1]){
            let start = this.parser.strToNumber(m[1]);
            if ( !isNaN(start) ){ this.counter = start }
        }
        if (m[2]){
            let step = this.parser.stdStrToNumber(m[2]);
            if ( !isNaN(step) ){ this.step = step }
        }
    }

    getValue(str){
        return this.parser.getValue(this.pattern, this.counter);
    }

    substitute(line, match){
        let val = this.getValue();
        this.counter += this.step;
        return line.replace(match[0], val);
    }
}


function substituteEnumerations(text){
    // TODO: named enumerations
    let lines = text.split('\n');
    let regex = /(?<!\\)#.*?([^\\]#)/g;  // TODO: will lookbehind work in browsers?
    let enumerators = {}
    let newText = '';
    for (line of lines){
        // search for count structures
        // note that there might be many of them in a single line
        let matchesIterator = line.matchAll(regex);
        let newLine = line;
        if (matchesIterator){
            // matchAll returns an iterator, that we want to iterate in reverse order
            let matches = []
            for (let match of matchesIterator){
                matches.push(match);
            }
            // now for the right iteration
            for (let i = matches.length - 1; i >= 0; i--){  // TODO: reverse order still makes sense?
                let match = matches[i];
                // clear pattern (get rid of start and step information)
                let [enumSettings, pattern] = Enumeration.clearPattern(match[0]);
                if (!(pattern in enumerators)){
                    // get parser object
                    enumerators[pattern] = new Enumeration(pattern);
                }
                // set/reset enumeration start and step
                if (enumSettings){
                    enumerators[pattern].applySettings(enumSettings);
                }
                // use parser to substitute string
                newLine = enumerators[pattern].substitute(newLine, match);
            }
        }
        newText += newLine + '\n';
    }
    return newText;
}

// Handle substitutions =======================================================

function handleSubstitutions(text){
    // TODO: proper escaping
    // TODO: handle all-whitespace cases
    // TODO: definition after use
    // {{ token=value }} for assigning and insert
    // {{ token }} for insert
    let newText = "";
    let values = new Map();
    for (let line of text.split('\n')){
        let matchesIterator = line.matchAll(/{{([^=}]+)=?([^}]*)}}/g);
        newLine = line;
        for (let match of matchesIterator){
            let key = match[1].trim();
            if (match[2].length){
                values[key] = match[2].trim();
            }
            newLine = newLine.replace(match[0], values[key]);
        }
        newText += newLine + "\n"
    }
    return newText;
}

// HTML conversion ============================================================

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

function convert(text){
    text = escapeHTML(text);
    text = substituteEnumerations(text);
    text = handleSubstitutions(text);
    // TODO: get rid of escape signs "\" and \r
    return convertToHTML(text);
}


module.exports.convert = convert
