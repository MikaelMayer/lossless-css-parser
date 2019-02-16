#!/usr/bin/env node
var fs = require("fs");
eval(fs.readFileSync("losslesscss.js", "utf8"));

var cssParser = new this.losslesscssjs();

eval(fs.readFileSync("tests/data.js", "utf8"));

function matchesExpectations(output, expected, path) {
  if(typeof output == "object") {
    if(typeof expected == "object") {
      for(var key in expected)
        matchesExpectations(output[key], expected[key], (path || ".") + " > "+ key);
    } else {
      console.log("Expected " + expected + ", got " + output  + " at " + (path || ""))
    }
  } else if(typeof output == typeof expected) {
    if(output != expected) {
      console.log("Expected " + expected + ", got " + output + " at " + (path || ""));
    }
  } else {
    console.log("Expected " + expected + ", got " + output  + " at " + (path || ""))
  }
}

for(var key in testData) {
  var {input, output: expected} = testData[key];
  
  var output = cssParser.parseCSS(input);
  expected = JSON.parse(expected);
  matchesExpectations(output, expected, key);
  
  var finalInput = cssParser.unparseCSS(output);
  if (input != finalInput) {
    console.log("At " + key + " after unparsing: Expected\n" + input + "\ngot\n" + finalInput);
  }
}