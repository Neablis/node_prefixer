(function (name, definition) {
    if (typeof module !== 'undefined') {
        module.exports = definition();
    } else if (typeof define === 'function' && typeof define.amd === 'object') {
        define(definition);
    } else {
        this[name] = definition();
    }
}('Parser', function () {

	'use strict';
	var Parser = function () {
	    this.operandStack = [];
	    this.operationStack = [];
	};
	
	Parser.prototype.evaluate = function () {
        var operator = this.operationStack.pop(), x, y;
        if(operator === "abs"){
        	x = parseInt(this.operandStack.pop(), 10);
        }
        else{
        	x = parseInt(this.operandStack.pop(), 10);
        	y = parseInt(this.operandStack.pop(), 10);
        }

    	if (operator === 'add') {
    		return parseInt(y+x, 10);
    	} else if (operator === 'subtract') {
    		return parseInt(y-x, 10);
    	} else if (operator === 'multiply') {
    		return parseInt(y*x, 10);
    	} else if (operator === 'abs') {
    		return Math.abs(x);
    	}
    };

    Parser.prototype.solve = function (tokens) {
    	var count = 0; 
    	var begin = 0;

        while (count < tokens.length) {
            if(tokens[count] === '('){
                this.operationStack.push(tokens.slice(begin, count));
                begin = count+1;
            }
            if(tokens[count] === ')'){
                if(tokens[count-1] !== ')'){
                    this.operandStack.push(tokens.slice(begin, count));
                    begin = count+1;
                    this.operandStack.push(this.evaluate());
                }
                else{
                    begin = count+1;
                    this.operandStack.push(this.evaluate());
                }
            }
            if(tokens[count] == ','){
                if(tokens[count-1] !== ')'){
                    this.operandStack.push(tokens.slice(begin, count));
                    begin = count+1;
                }
                else{
                    begin++;
                }
            }
            count++;
        }

        return this.operandStack.pop();
    };

    Parser.prototype.escapeRegExp = function (string, find, replace) {
    	return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
	}

    Parser.prototype.replaceAll = function (string, find, replace) {
  		return string.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
	}

	return Parser;
}));
