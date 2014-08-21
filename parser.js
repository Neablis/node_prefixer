/*
 * http://en.wikipedia.org/wiki/Shunting-yard_algorithm
 *
 */
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
    var Parser,
        values = /[a-zA-Z0-9]/;

    Parser = function () {
        var that = this,
            tokens,
            opers = 
                {'+':function (a,b) {
                    return parseFloat(a)+parseFloat(b);
                }, '-': function (a,b) {
                    return parseFloat(a)-parseFloat(b);
                }, '*': function (a,b) {
                    return parseFloat(a)*parseFloat(b);
                }, '/': function (a,b) {
                    return parseFloat(a)/parseFloat(b);
                }, '^': function (a,b) {
                    return Math.pow(parseFloat(a),parseInt(b));
                }, '$': function (a,b) {
                    return Math.abs(parseFloat(b));                                                    
                }};
        this.stack = [];
        this.output = [];
        this.ast = null;
        
        return {
            parse: function (tokens) {
                tokens = tokens.replace(/\s{2,}/g, ' ').split(' ');
                return that.parse(tokens);
            },
            evaluate: function (tokens, method) {
                var tree;
                tokens = tokens.replace(/\s{2,}/g, ' ').split(' ');
                tree = that.parse(tokens);
                if (method === undefined) {
                    return that.print_pre(tree);
                } else if (method === 'post') {
                    return that.print_post(tree);
                } else if (method === 'infix') {
                    return that.print_infix(tree);
                }
                return '';
            },
            solve: function (tokens) {
                tokens = tokens.replace(/\s{2,}/g, ' ').split(' ');
                var tree = that.parse(tokens);
                return this.solver(tree);
            },
            solver: function (tree) {
                var fn = function () {};

                if (typeof tree === 'object') {
                    fn = opers[tree.operator];
                    if (fn === undefined) {
                        debugger;
                    }
                    return fn(this.solver(tree.leaves[0]),this.solver(tree.leaves[1]));
                } else {
                    return tree;
                }
            }
        };
    };

    Parser.prototype = {
            operator: /[+\-*\/\^%$]/,
            weights: {'+': 2, '-': 2, '*': 3, '/': 3, '%': 3, '^': 4, '$': 4},
            parse: function (tokens) {

                // If only 1 token, that is your equation
                if (tokens.length === 1) {
                    this.ast = tokens[0];
                } else {
                    //read a token
                    while (tokens.length) {
                        this.read_token(tokens.shift());
                    }

                    // When there are no more tokens to read:
                    while (this.stack.length) {
                        // Pop the operator onto the output queue.
                        this.createNodeFromStack();
                    }
                    this.ast = this.output.pop();
                }

                return this.ast;
            },

            // Center, Left, Right
            print_pre: function (node) {
                var str,
                    left,
                    right,
                    i;

                if (typeof node === 'string') {
                    str = node;
                } else {
                    str = '(' + node.operator;
                    for (i = 0; i < node.leaves.length; i += 1) {
                        str += " " + this.print_pre(node.leaves[i]);
                    }
                    str += ')';
                }

                return str;
            },

            // Print left, right, center
            print_post: function (node) {
                var str = '',
                    i;

                if (typeof node === 'string') {
                    str = node;
                } else {
                    str += '(';

                    for (i = 0; i < node.leaves.length; i += 1) {
                        str += this.print_post(node.leaves[i]);
                    }
                    str += node.operator;
                    str += ')';

                }

                return str;
            },

            // Print left, center, right
            print_infix: function (node) {
                var str = '',
                    left,
                    right,
                    i;

                if (typeof node === 'string') {
                    str = node;
                } else {
                    str += '(';

                    str += this.print_infix(node.leaves[0]);
                    str += node.operator;
                    str += this.print_infix(node.leaves[1]);
                    str += ')';
                }

                return str;
            },
            read_token: function (token) {
                var op1, op2, node;
                // If the token is a number, then add it to the output queue.
                if (token.match(values)) {
                    this.output.push(token);
                // If the token is an operator, o1, then
                } else if (token.match(this.operator)) {
                    // while there is an operator token, o2, at the top of the stack
                    while (this.stack.length && this.stack[this.stack.length -1].match(this.operator)) {
                        op1 = token;
                        op2 = this.stack[this.stack.length -1];

                        // either o1 is left-associative and its precedence is equal to that of o2, or o1 has precedence less than that of o2
                        if ((op1 !== '^'  && this.weights[op1] <= this.weights[op2]) || (op1 === '^' && this.weights[op1] < this.weights[op2]) || (op1 === '$')) {
                            // pop o2 off the stack, onto the output queue;
                            this.createNodeFromStack();
                        } else {
                            break;
                        }
                    }
                    // push o1 onto the stack.
                    this.stack.push(token);
                // If the token is a left parenthesis, then push it onto the stack.
                } else if (token === '(') {
                    this.stack.push(token);
                // If the token is a right parenthesis
                } else if (token === ')') {
                    // Until the token at the top of the stack is a left parenthesis, pop operators off the stack onto the output queue.
                    while (this.stack.length && this.stack[this.stack.length - 1] !== '(') {
                        this.createNodeFromStack();
                    }

                    // Pop the left parenthesis from the stack, but not onto the output queue.
                    if (this.stack[this.stack.length -1] === '(') {
                        this.stack.pop();
                    } else {
                        // If the stack runs out without finding a left parenthesis, then there are mismatched parentheses.
                        throw new Error ('Mismatched Parens');
                    }
                } else {
                    throw new Error('Invalid token');
                }
            },

            //Take 2 nodes from output stack to create a tree node.
            //        Stack
            //      *       *
            //    Output  Output
            //
            createNodeFromStack: function () {
                var operator = this.stack.pop(),
                    right,
                    left, 
                    node;

                right = this.output.pop(),
                left = this.output.pop(),
                node = this.makeNode(operator, [].concat(left, right));

                this.output.push(node);
            },

            makeNode: function (op, leaves) {
                var node = {
                        operator: op,
                        leaves: leaves
                    };

                return node;
            },
    };
    
    return Parser;
}));




