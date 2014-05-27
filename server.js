#!/usr/bin/env node
"use strict";
var fs = require('fs'),
    Parser = require('./parser'),
    file_name,
    reduce = false,
    args = process.argv.slice(2),
    method;

if (args.length === 0) {
  process.stdout.write('Command line arguments incorrect\n');
  process.exit(1);
}

args.forEach(function (val, index, array) {

  switch (val) {
    case "-r":
      reduce = true;
      break;
    case "-m":
      if (args[index+1] !== undefined) {
        method = args[index+1];
      } else {
        process.stdout.write('Please provice a -m value\n');
        process.exit(1);
      }
      break;
    default:
      if (args[index-1] !== '-m' && file_name === undefined) {
        file_name = val;
      } else if (args[index-1] !== '-m') {
        process.stdout.write('Unexpected command line parameter\n');
        process.exit(1);
      }
      break;
  }
});

if (!file_name) {
    process.stdout.write('Please provide a file to process\n');
    process.exit(1);
}

fs.exists(file_name, function (exists){
    if (!exists) {
        process.stdout.write('File not found: ' + file_name + '\n');
        process.exit(1);
    } else {
        fs.readFile(file_name, 'utf8', function (err, data) {
            var EOL = data.indexOf("\r\n") >= 0 ? "\r\n" : "\n",
                lineEnd = new RegExp(EOL, 'g'),
                parser = new Parser(),
                lines;

            lines = data.split(lineEnd);
            lines.pop();

            lines.forEach(function(expr){
                var output = '';

                output = expr + ' -> ' + parser.evaluate(expr, method);

                process.stdout.write(output + EOL);
            });
        });
    }
});
