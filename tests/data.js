var testData = {
    veryBasicCSS: {
        input: '.someClass{someDirective:someValue;}',
        output: '[{"selector":".someClass","rules":[{"directive":"someDirective","value":"someValue"}]}]'
    },
    basicCSS: {
        input: 'html{\n    color:black;\n}',
        output: '[{"selector":"html","rules":[{"directive":"color","value":"black"}]}]'
    },
    basicCSS2: {
        input: '/*\nSome Comments\nBaby \n*/\nhtml{\n    color:black;\n}',
        output: '[{"selector":"html","rules":[{"directive":"color","value":"black"}]}]'
    },
    basicCSS3: {
        input: '\n\/*\n    Some Comment\n*\/\nhtml{\n    color:black;\n}\nbody { var-my-margin: 12px }\nh1 {  margin-top: var(my-margin);\n      background-image: linear-gradient(to top, white, #c0c0c0); }\n',
        output: '[{"selector":"html","rules":[{"directive":"color","value":"black"}]},{"selector":"body","rules":[{"directive":"var-my-margin","value":"12px"}]},{"selector":"h1","rules":[{"directive":"margin-top","value":"var(my-margin)"},{"directive":"background-image","value":"linear-gradient(to top, white, #c0c0c0)"}]}]'
    },
    basicCSS4: {
        input: '.someClass{someDirective:some\n Value;}',
        output: '[{"selector":".someClass","rules":[{"directive":"someDirective","value":"some\\n Value"}]}]'
    },
    basicCSS5: {
        input: '.someClass{margin:0;}',
        output: '[{"selector":".someClass","rules":[{"directive":"margin","value":"0"}]}]'
    },
    advCSS: {
        input: '@media screen and (min-width: 780px) {\n  .supernova {\n    background-color: #fafafa;\n  }\n}',
        output: '[{"selector":"@media", "atNameValue":"screen and (min-width: 780px)","type":"@media","content":[{"selector":".supernova","rules":[{"directive":"background-color","value":"#fafafa"}]}]}]'
    },
    advCSS2: {
        input: '@media screen and (min-width: 780px) and (max-width: 840px) {\n  .supernova {\n    padding: 30px 0;\n  }\n}\n@media screen and (min-width: 840px) and (max-width: 900px) {\n  .supernova {\n    padding: 60px 0;\n  }\n}',
        output: '[{"selector":"@media", "atNameValue":"screen and (min-width: 780px) and (max-width: 840px)","type":"@media","content":[{"selector":".supernova","rules":[{"directive":"padding","value":"30px 0"}]}]},{"selector":"@media", "atNameValue":"screen and (min-width: 840px) and (max-width: 900px)","type":"@media","content":[{"selector":".supernova","rules":[{"directive":"padding","value":"60px 0"}]}]}]'
    },
    advCSS3: {
        input: '@media screen and (min-width: 780px) {\n  .supernova {\n    background-color: #fafafa;\n  }\n  .supernova body {\n    background-color: #fafafa;\n  }\n  .supernova .form-all {\n    border: 1px solid #e1e1e1;\n    -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.1);\n    -moz-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.1);\n    box-shadow: 0 3px 9px rgba(0, 0, 0, 0.1);\n  }\n}\n@media screen and (min-width: 780px) and (max-width: 840px) {\n  .supernova {\n    padding: 30px 0;\n  }\n}\n@media screen and (min-width: 840px) and (max-width: 900px) {\n  .supernova {\n    padding: 60px 0;\n  }\n}\n@media screen and (min-width: 900px) {\n  .supernova {\n    padding: 90px 0;\n  }\n}\n.form-all {\n  background-color: #ffffff;\n}\n.form-header-group {\n  border-color: #e6e6e6;\n}\n.form-matrix-table tr {\n  border-color: #e6e6e6;\n}\n.form-matrix-table tr:nth-child(2n) {\n  background-color: #f2f2f2;\n}',
        output: '[{"selector":"@media", "atNameValue":"screen and (min-width: 780px)","type":"@media","content":[{"selector":".supernova","rules":[{"directive":"background-color","value":"#fafafa"}]},{"selector":".supernova body","rules":[{"directive":"background-color","value":"#fafafa"}]},{"selector":".supernova .form-all","rules":[{"directive":"border","value":"1px solid #e1e1e1"},{"directive":"-webkit-box-shadow","value":"0 3px 9px rgba(0, 0, 0, 0.1)"},{"directive":"-moz-box-shadow","value":"0 3px 9px rgba(0, 0, 0, 0.1)"},{"directive":"box-shadow","value":"0 3px 9px rgba(0, 0, 0, 0.1)"}]}]},{"selector":"@media", "atNameValue":"screen and (min-width: 780px) and (max-width: 840px)","type":"@media","content":[{"selector":".supernova","rules":[{"directive":"padding","value":"30px 0"}]}]},{"selector":"@media", "atNameValue":"screen and (min-width: 840px) and (max-width: 900px)","type":"@media","content":[{"selector":".supernova","rules":[{"directive":"padding","value":"60px 0"}]}]},{"selector":"@media", "atNameValue":"screen and (min-width: 900px)","type":"@media","content":[{"selector":".supernova","rules":[{"directive":"padding","value":"90px 0"}]}]},{"selector":".form-all","rules":[{"directive":"background-color","value":"#ffffff"}]},{"selector":".form-header-group","rules":[{"directive":"border-color","value":"#e6e6e6"}]},{"selector":".form-matrix-table tr","rules":[{"directive":"border-color","value":"#e6e6e6"}]},{"selector":".form-matrix-table tr:nth-child(2n)","rules":[{"directive":"background-color","value":"#f2f2f2"}]}]'
    },
    advCSS4: {
        input: '@font-face {\nfont-family: myFirstFont;\nsrc: url(sansation_light.woff);\n}',
        output: '[{"selector":"@font-face","type":"cssBlock","rules":[{"directive":"font-family","value":"myFirstFont"},{"directive":"src","value":"url(sansation_light.woff)" }] }]'
    },
    advCSS5: {
        input: '@font-face {\nfont-family: myFirstFont;\nsrc: url(sansation_light.woff) format(woff)\nurl(sansation_light.otf) format(opentype);\n}',
        output: '[{"selector":"@font-face","type":"cssBlock","rules":[{"directive":"font-family","value":"myFirstFont"},{"directive":"src","value":"url(sansation_light.woff) format(woff)\\nurl(sansation_light.otf) format(opentype)" }] }]'
    },
    advCSS6: {
        input: '/*--------------------------------------------------------------\nA big comment\n--------------------------------------------------------------*/@media screen and (min-width: 780px) {\n  .supernova {\n    background-color: #fafafa;\n  }\n}',
        output: '[{"selector":"@media", "atNameValue":"screen and (min-width: 780px)","type":"@media","content":[{"selector":".supernova","rules":[{"directive":"background-color","value":"#fafafa"}]}]}]'
    },
    horribleCSS: {
        input: 'test /*{*/ [option="}\\"/*"] { /*}*/ content: \'}\'; ; }',
        output: '[{"selector":"test /*{*/ [option=\\"}\\\\\\"/*\\"]", "rules":[{"directive": "content", "value": "\'}\'"}], "wsBeforeClosingBrace":" ; "}]'
    }
};

var cssDiffFailedValues = [
    {
        css1 : '{"selector":".form-textarea, .form-textbox","rules":[{"directive":"border","value":"1px solid #b7bbbd"},{"directive":"-webkit-border-radius","value":"2px"},{"directive":"-moz-border-radius","value":"2px"},{"directive":"border-radius","value":"2px"},{"directive":"padding","value":"4px"},{"directive":"background","value":"transparent !important"},{"directive":"width","value":"100%"},{"directive":"-webkit-appearance","value":"none"},{"directive":"-webkit-box-shadow","value":"inset 0 0 4px rgba(0,0,0,0.2), 0 1px 0 rgb(255,255,255)"},{"directive":"-moz-box-shadow","value":"inset 0 0 4px rgba(0,0,0,0.2), 0 1px 0 rgb(255,255,255)"},{"directive":"box-shadow","value":"inset 0 0 4px rgba(0,0,0,0.2), 0 1px 0 rgb(255,255,255)"},{"directive":"border","value":"1px solid #AEAEAE"},{"directive":"color","value":"#333"},{"directive":"font-family","value":"\\"Verdana\\", sans-serif"},{"directive":"-webkit-box-sizing","value":"border-box"},{"directive":"-moz-box-sizing","value":"border-box"},{"directive":"box-sizing","value":"border-box"}]}',
        css2 : '{"selector":".form-textarea, .form-textbox","rules":[{"directive":"border","value":"1px solid #b7bbbd"},{"directive":"-webkit-border-radius","value":"2px"},{"directive":"-moz-border-radius","value":"2px"},{"directive":"border-radius","value":"2px"},{"directive":"padding","value":"4px"},{"directive":"background","value":"transparent !important"},{"directive":"width","value":"100%"},{"directive":"-webkit-appearance","value":"none"},{"directive":"-webkit-box-shadow","value":"inset 0 0 4px rgba(0,0,0,0.2), 0 1px 0 rgb(255,255,255)"},{"directive":"-moz-box-shadow","value":"inset 0 0 4px rgba(0,0,0,0.2), 0 1px 0 rgb(255,255,255)"},{"directive":"box-shadow","value":"inset 0 0 4px rgba(0,0,0,0.2), 0 1px 0 rgb(255,255,255)"},{"directive":"border","value":"1px solid #AEAEAE"},{"directive":"color","value":"#333"},{"directive":"font-family","value":"\\"Verdana\\", sans-serif"},{"directive":"-webkit-box-sizing","value":"border-box"},{"directive":"-moz-box-sizing","value":"border-box"},{"directive":"box-sizing","value":"border-box"}]}',
        output : false
    }
];
