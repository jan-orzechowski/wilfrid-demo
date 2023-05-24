ace.define('ace/mode/nous', function(require, exports, module) {

  var oop = require("ace/lib/oop");
  var TextMode = require("ace/mode/text").Mode;
  var NousHighlightRules = require("ace/mode/nous_highlight_rules").NousHighlightRules;
  
  var Mode = function() {
      this.HighlightRules = NousHighlightRules;
  };
  oop.inherits(Mode, TextMode);
  
  (function() {
      // Extra logic goes here. (see below)
  }).call(Mode.prototype);
  
  exports.Mode = Mode;
});