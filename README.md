# Lossless CSS parser

A lossless, robust and fast CSS parser in JavaScript.

Although it is regex-based, it correctly interprets CSS strings and comments.

# Development

Following commands will prepare development enviroment by installing dependencies:

```
npm install
```

To execute unit tests, execute

```
tests/cssParsing.test.js
```

# How To Install

```
npm install lossless-css-parser
```

# How To Use

On the browser
------

Simply parse css string, and log the output

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/MikaelMayer/lossless-css-parser@master/losslesscss.js"></script>
<script type="text/javascript">
	var cssString = ' .someSelector { margin:40px 10px; padding:5px}';
	//initialize parser object
	var parser = new losslesscssjs();
	//parse css string
	var parsed = parser.parseCSS(cssString);
	console.log(parsed);
  //unparse css object
  var unparsed = parser.unparseCSS(parsed);
  // Unparsing exactly produces the original string. Displays true.
  console.log(cssString == unparsed)
</script>
```


On the server
------


```js
var cssString = ' .someSelector { margin:40px 10px; padding:5px}';
//require parser constructor
var losslesscssjs = require("./losslesscss.js");
//initialize parser object
var parser = new losslesscssjs.losslesscssjs();
//parse css string
var parsed = parser.parseCSS(cssString);

console.log(parsed);
//unparse css object
var unparsed = parser.unparseCSS(parsed);
// Unparsing exactly produces the original string. Displays true.
console.log(cssString == unparsed)
```

# CSS parsing result

```
type alias CssRules =
  Array (
    {
      wsBefore: String,
    directive: String,
      wsBeforeColon: String, //:
      wsBeforeValue: String,
    value: String,
      wsSemicolon: String // whitespace until semicolon included
    }
  )

type alias CssTopLevel = 
  Array (
    {
      type: "@charset" | "@import",
        wsBefore: String,
      selector: String, // '@charset' or '@import'
        wsBeforeValue: String,
      value: String,
        wsBeforeAndSemicolon: String
    }
    | {
      type: "@keyframes" | "@media",
        wsBefore: String,
      selector: String, // "@keyframes" or "@media"
        wsBeforeAtNameValue: String,
      atNameValue: String,
        wsBeforeOpeningBrace: String, // '{' after this one
      content: CssTopLevel,
        wsBeforeClosingBrace: String, // '}' after this one
    }
    | {
      type: "cssBlock",
        wsBefore: String,
      selector: String,
        wsBeforeOpeningBrace: String, // '{' after this one
      rules: CssRules,
        wsBeforeClosingBrace: String  // '}' after t his one
    }
    | {
      type: "whitespace",
      ws: String
    }
  )


parseCSS: String -> CssTopLevel
unparseCSS: CssTopLevel -> String  
```

# Credits:

Test data and basic structure has been imported from https://github.com/jotform/css.js