(function() {
  var Markdown, root;
  Markdown = (function() {
    function Markdown() {}
    Markdown.prototype.toHTML = function(src) {
      var hashes, lvl, pattern, _i, _len, _ref;
      _ref = [6, 5, 4, 3, 2, 1];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        lvl = _ref[_i];
        hashes = Array(lvl + 1).join('#');
        pattern = new RegExp("^" + hashes + "\\s?(.*)$", "gm");
        src = src.replace(pattern, "<h" + lvl + ">$1</h" + lvl + ">");
      }
      return src;
    };
    return Markdown;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Markdown = Markdown;
}).call(this);
