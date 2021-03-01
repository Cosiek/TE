class BaseEnumerationParser{
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

module.exports.BaseEnumerationParser = BaseEnumerationParser
