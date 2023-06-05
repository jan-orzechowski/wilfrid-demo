ace.define('ace/mode/wilfrid', function(require, exports, module) {

  var oop = require("ace/lib/oop");
  var TextMode = require("ace/mode/text").Mode;
  var WilfridHighlightRules = require("ace/mode/wilfrid_highlight_rules").WilfridHighlightRules;
  
  var Mode = function() {
      this.HighlightRules = WilfridHighlightRules;
  };
  oop.inherits(Mode, TextMode);  
  exports.Mode = Mode;
});