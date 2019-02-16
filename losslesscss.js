/* jshint unused:false */
/* global window, console */
(function(global) {
  'use strict';
  const any = '[\\s\\S]';
  const commentStart = '\\/\\*';
  const commentEnd = '\\*\\/';
  const stringStart = '"';
  const string2Start = "'";
  const stringEnd = '"';
  const string2End = "'";
  const bs = "\\\\";
  const allXept = (regex, escapes) => escapes ? `(?:(?:(?!${regex})${any})|${escapes})*?` :
     `(?:(?!${regex})${any})*?`;
  const allXeptCommentStringStart = allXept(`${commentStart}|${stringStart}|${string2Start}`);
  const allXeptCommentEnd = allXept(commentEnd);
  const allXeptStringEnd  = allXept(stringEnd + `|${bs}`,  `${bs}"|${bs}${bs}|${bs}[0-9a-fA-F]+|${bs}${any}`);
  const allXeptString2End = allXept(string2End + `|${bs}`, `${bs}'|${bs}${bs}|${bs}[0-9a-fA-F]+|${bs}${any}`);
  const content = `${allXeptCommentStringStart}`+
    `(?:(?:${commentStart}${allXeptCommentEnd}${commentEnd}`+
          `|${stringStart}${allXeptStringEnd}${stringEnd}`+
          `|${string2Start}${allXeptString2End}${string2End})`+
     `${allXeptCommentStringStart})*?`
  
  const allXeptComment = allXept(`${commentStart}`);
  const wsXept = (regex, escapes) => escapes ? `(?:(?:(?!${regex})\\s)|${escapes})*` : // Greedy
     `(?:(?!${regex})\\s)*`;
  const ws = `${wsXept(commentStart)}(?:${commentStart}${allXeptCommentEnd}${commentEnd}${wsXept(commentStart)})*`
  
  const nested = (atName) => `^(${ws})(${atName})(${ws})(${content})(${ws})\\{(${content})(\\})(${ws})\\}`
  const singleDirective = (atName) => `^(${ws})(${atName})(${ws})(.*?)(${ws};)`
  const cssRegex = new RegExp(`^(${ws})(${content})(${ws})\{(${content})\}`, 'gi');
  const cssMediaQueryRegex = new RegExp(nested("@media"), "gi");
  const cssKeyframeRegex   = new RegExp(nested("@keyframes"), "gi");
  const cssCharSetRegex =    new RegExp(singleDirective("@charset"), "gi");
  const cssImportStatementRegex = new RegExp(singleDirective("@import"), "gi");
  const cssRuleRegex = new RegExp(`^(${ws})(${content})(${ws}):(${ws})(${content})(${ws};|${ws}(?=$$))`, "gi");
  const cssWs = new RegExp(`^${ws}$`, 'gi')
  
  const exec = (regex, string) => { regex.lastIndex = 0; return regex.exec(string) }

  var losslesscssjs = function() {};

  /*
    Parses given css string, and returns css object
    keys as selectors and values are css rules

    @param source css string to be parsed

    @return object css : List { selector, type, styles }
  */
  losslesscssjs.prototype.parseCSS = function(source) {
    if (source === undefined) {
      return [];
    }

    var css = [];

    var canCharSet = true;
    var canImport = true;
    var arr;
    var line = 1;
    function removeArrMatch() {
      //arr.index should always be 0
      var removed = source.substring(0, arr[0].length);
      source = source.substring(arr[0].length);
      line = line + removed.split("\n").length - 1;
    }
    while (true) { // Just acts as a label.
      if(canCharSet) {
        arr = exec(cssCharSetRegex, source);
        if(arr !== null) {
          css.push({
            type: "@charset",
              wsBefore: arr[1],
            selector: arr[2], // '@charset'
              wsBeforeValue: arr[3],
            value: arr[4],
              wsBeforeAndSemicolon: arr[5]
          });
          removeArrMatch();
          continue;
        }
        canCharSet = false;
      }
      if(canImport) {
        arr = exec(cssImportStatementRegex, source);
        if (arr !== null) {
          css.push({
            type: "@import",
              wsBefore: arr[1],
            selector: arr[2], // '@charset'
              wsBeforeValue: arr[3],
            value: arr[4],
              wsBeforeAndSemicolon: arr[5]
          });
          removeArrMatch();
          continue;
        }
        canImport = false;
      }

      //get keyframes statements
      arr = exec(cssKeyframeRegex, source);
      if (arr !== null) {
        css.push({
          type: '@keyframes',
            wsBefore: arr[1],
          selector: arr[2], // @keyframes
            wsBeforeAtNameValue: arr[3],
          atNameValue: arr[4],
            wsBeforeOpeningBrace: arr[5],
          content: this.parseCSS(arr[6] + arr[7]),
            wsBeforeClosingBrace: arr[8]
        });
        removeArrMatch();
        continue;
      }

      arr = exec(cssMediaQueryRegex, source);
      if (arr !== null) {
        //we have a media query
        var cssObject = {
          type: '@media',
            wsBefore: arr[1],
          selector: arr[2], // @media
            wsBeforeAtNameValue: arr[3],
          atNameValue: arr[4],
            wsBeforeOpeningBrace: arr[5],
          content: this.parseCSS(arr[6] + arr[7]),
            wsBeforeClosingBrace: arr[8]
        };
        css.push(cssObject);
        removeArrMatch();
        continue;
      }
      
      arr = exec(cssRegex, source);
      if(arr !== null) {
        var [rules, wsBeforeClosingBrace] = this.parseRules(arr[4], line + (arr[1]+arr[2]+arr[3]).split("\n").length - 1);
        var style = {
            type: "cssBlock",
            wsBefore: arr[1],
            selector: arr[2],
            wsBeforeOpeningBrace: arr[3], // {
            rules: rules,
            wsBeforeClosingBrace: wsBeforeClosingBrace  // }
          };
        css.push(style);
        removeArrMatch();
        continue;
      }
      break;
    }
    arr = exec(cssWs, source);
    if(arr !== null) {
      css.push({type: 'whitespace', ws: arr[0]});
    } else {
      css.push({type: 'whitespace', ws: source});
      this.lastError = "Line " + line + ":\ncould not parse this as css (and it's not a final whitespace): " + source;
      console.log(this.lastError);
    }
    return css;
  };

  /*
    parses given string containing css directives
    and returns an 2-element array of
      array of {directive, value, wsBefore, wsBeforeColon, wsBeforeValue, wsSemicolon}
      last whitespace or remaining directives that could not be parsed

    @param rules, css directive string example
        \n\ncolor:white;\n    font-size:18px;\n
    @param line, optional starting line number
  */
  losslesscssjs.prototype.parseRules = function(rules, line) {
    line = line || 1;
    var ret = [];
    
    var arr;
    var line = 1;
    function removeArrMatch() {
      //arr.index should always be 0
      var removed = rules.substring(0, arr[0].length);
      rules = rules.substring(arr[0].length);
      line = line + removed.split("\n").length - 1;
    }
    while(true) {
      arr = exec(cssRuleRegex, rules);
      if(arr !== null) {        
        ret.push({
            wsBefore: arr[1],
          directive: arr[2],
            wsBeforeColon: arr[3], //:
            wsBeforeValue: arr[4],
          value: arr[5],
            wsSemicolon: arr[6] // includes semicolon
        });
        removeArrMatch();
        continue;
      }
      break;
    }
    if(exec(cssWs, rules) === null) {
      this.lastError ="Line " + line + ":\ncould not parse this as css rules (and it's not a final whitespace): " + rules;
      console.log(this.lastError);
    }
    return [ret, rules]; //we are done!
  };
  
  losslesscssjs.prototype.unparseRules = function(rules) {
    var ret = "";
    for(var i in rules) {
      var rule = rules[i];
      ret += rule.wsBefore;
      ret += rule.directive;
      ret += rule.wsBeforeColon;
      ret += ":";
      ret += rule.wsBeforeValue;
      ret += rule.value;
      ret += rule.wsSemicolon;
    }
    return ret;
  }

  losslesscssjs.prototype.unparseCSS = function(cssBase, depth) {
    if (depth === undefined) {
      depth = 0;
    } 
    var ret = '';
    if (cssBase === undefined) {
      cssBase = this.css;
    }
    for(var i in cssBase) {
      var cssElem = cssBase[i];
      var t = cssElem.type;
      if(t === '@import' || t === '@charset') {
        ret += cssElem.wsBefore;
        ret += cssElem.selector; // @import or @charset
        ret += cssElem.wsBeforeValue;
        ret += cssElem.value;
        ret += cssElem.wsBeforeAndSemicolon;
      } else if(t === '@keyframes' || t == '@media') {
        ret += cssElem.wsBefore;
        ret += cssElem.selector; // @keyframes or @media
        ret += cssElem.wsBeforeAtNameValue;
        ret += cssElem.atNameValue;
        ret += cssElem.wsBeforeOpeningBrace;
        ret += "{";
        ret += this.unparseCSS(cssElem.content);
        ret += cssElem.wsBeforeClosingBrace;
        ret += "}";
      } else if(t === 'cssBlock') {
        ret += cssElem.wsBefore;
        ret += cssElem.selector;
        ret += cssElem.wsBeforeOpeningBrace;
        ret += "{";
        ret += this.unparseRules(cssElem.rules);
        ret += cssElem.wsBeforeClosingBrace;
        ret += "}";
      } else if(t === 'whitespace') {
        ret += cssElem.ws;
      } else {
        console.log("Unknown type to unparse:", cssElem);
      }
    }

    return ret;
  };

  global.losslesscssjs = losslesscssjs;

})(this);