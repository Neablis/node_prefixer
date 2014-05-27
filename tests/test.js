var assert = require("assert");
var Parser = require("../parser.js");

var parser = new Parser();

assert.deepEqual(parser.evaluate('3'), '3');
assert.deepEqual(parser.evaluate('1 + 1'), '(+ 1 1)');
assert.deepEqual(parser.evaluate('2 * 5 + 1'), '(+ (* 2 5) 1)');
assert.deepEqual(parser.evaluate('2 * ( 5 + 1 )'), '(* 2 (+ 5 1))');
assert.deepEqual(parser.evaluate('2 * ( 5 / 1 )'), '(* 2 (/ 5 1))');
assert.deepEqual(parser.evaluate('3 * x + ( 9 + y ) / 4'), '(+ (* 3 x) (/ (+ 9 y) 4))');
assert.deepEqual(parser.evaluate('3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3'), '(+ 3 (/ (* 4 2) (^ (- 1 5) (^ 2 3))))');
assert.deepEqual(parser.evaluate('3 / 9'), '(/ 3 9)');
assert.deepEqual(parser.evaluate('a * b * c * d'), '(* (* (* a b) c) d)');
assert.deepEqual(parser.evaluate('a * a * b * c * c * c * d'), '(* (* (* (* (* (* a a) b) c) c) c) d)');
assert.deepEqual(parser.evaluate('a * ( b / c ) * ( d / e ) * f'), '(* (* (* a (/ b c)) (/ d e)) f)');
assert.deepEqual(parser.evaluate('( b / c ) * ( d / e ) * f * a'), '(* (* (* (/ b c) (/ d e)) f) a)');
assert.deepEqual(parser.evaluate('6 * 6 * ( 7 * 7 / 9 ) * ( 2 / 3 )'), '(* (* (* 6 6) (/ (* 7 7) 9)) (/ 2 3))');
assert.deepEqual(parser.evaluate('a * a * ( b * b / c ) * ( d / e )'), '(* (* (* a a) (/ (* b b) c)) (/ d e))');
assert.deepEqual(parser.evaluate('6 + 6 + ( ( 7 + 7 + 7 ) / 9 ) * ( 2 / 3 )'), '(+ (+ 6 6) (* (/ (+ (+ 7 7) 7) 9) (/ 2 3)))');
assert.deepEqual(parser.evaluate('( x ^ a ) * ( y ^ b ) * ( x ^ c )'), '(* (* (^ x a) (^ y b)) (^ x c))');
