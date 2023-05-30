ace.define('ace/mode/nous_highlight_rules', function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var NousHighlightRules = function() {
        var keywords = (
            "else|break|case|return|if|const|enum|" +
            "continue|struct|union|default|switch|for|" +
            "fn|variadic|extern|let|new|auto|delete|while|do"
        );
        var builtinTypes = (
            "int|uint|long|ulong|char|float|bool"
        );
        var builtinFunctions = (
            "printf|assert"
        );
        var builtinConstants = ("null|true|false");

        var keywordMapper = this.createKeywordMapper({
            "keyword": keywords,
            "constant.language": builtinConstants,
            "support.function": builtinFunctions,
            "support.type": builtinTypes
        }, "");
        
        this.$rules = {
            "start" : [
                {
                    token : "comment",
                    regex : "\\/\\/.*$"
                }, {
                    token : "comment", // multi line comment
                    regex : "\\/\\*",
                    next : "comment"
                }, {
                    token : "string.regexp",
                    regex : "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/][gimy]*\\s*(?=[).,;]|$)"
                }, {
                    token : "string", // " string start
                    regex : '"',
                    next : "qqstring"
                }, {
                    token : "constant.numeric", // hex
                    regex : "0[xX][0-9a-fA-F]+\\b" 
                }, {
                    token : "constant.numeric", // float
                    regex : "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
                }, {
                    token : ["keyword", "text", "entity.name.function"],
                    regex : "(fn)(\\s+)([a-zA-Z_$][a-zA-Z0-9_$]*)\\b"
                }, {
                    token : function(val) {
                        if (val[val.length - 1] == "(") {
                            return [{
                                type: keywordMapper(val.slice(0, -1)) || "support.function",
                                value: val.slice(0, -1)
                            }, {
                                type: "paren.lparen",
                                value: val.slice(-1)
                            }];
                        }                        
                        return keywordMapper(val) || "identifier";
                    },
                    regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b\\(?"
                }, {
                    token : "keyword.operator",
                    regex : "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^="
                }, {
                    token : "paren.lparen",
                    regex : "[[({]"
                }, {
                    token : "paren.rparen",
                    regex : "[\\])}]"
                }, {
                    token : "text",
                    regex : "\\s+"
                }
            ],
            "comment" : [
                {
                    token : "comment",
                    regex : "\\*\\/",
                    next : "start"
                }, {
                    defaultToken : "comment"
                }
            ],
            "qqstring" : [
                {
                    token : "constant.language.escape",
                    regex : '\\\\(?:[nrtvef\\\\"$]|[0-7]{1,3}|x[0-9A-Fa-f]{1,2})'
                }, {
                    token : "variable",
                    regex : /\$[\w]+(?:\[[\w\]+]|[=\-]>\w+)?/
                }, {
                    token : "variable",
                    regex : /\$\{[^"\}]+\}?/
                },
                { token : "string", regex : '"', next : "start"},
                { defaultToken : "string"}
            ]
        };
    };
    oop.inherits(NousHighlightRules, TextHighlightRules);

    exports.NousHighlightRules = NousHighlightRules;
});