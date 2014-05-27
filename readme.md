# Infix to prefix 

Node.js application to take a text file and parse infix to prefix tree. Can output as infix, prefix, or postfix.

Node server.js <filename> (-m post|infix)

For example:
3 becomes 3
1 + 1 becomes (+ 1 1)
2 * 5 + 1 becomes (+ 1 (* 2 5))
2 * ( 5 + 1 ) becomes (* (+ 1 5) 2)
3 * x + ( 9 + y ) / 4 becomes (+ (* 3 x) (/ (+ 9 y) 4))
