baseEnumeration = require('./base_enumeration');


class FloatEnumerationParser extends baseEnumeration.BaseEnumerationParser{
    regex = /\d+([\.,])\d+/

    getValue(pattern, number){
        pattern = pattern.substring(1, pattern.length-1);
        let separator = pattern.match(this.regex)[1];
        let numTxt = this.numberToStr(number).replace(/([\.,])/, separator);
        return pattern.replace(this.regex, numTxt);
    }

    numberToStr(number){
        return number % 1 ? number + "" : number + ".0";
    }
}


class IntEnumerationParser extends baseEnumeration.BaseEnumerationParser{
    regex = /\d+/
}


module.exports.FloatEnumerationParser = FloatEnumerationParser;
module.exports.IntEnumerationParser = IntEnumerationParser;
