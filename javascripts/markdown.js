(function() {
  var Markdown, root;
  Markdown = (function() {
    function Markdown() {
      this._generatePatterns();
    }
    Markdown.prototype.toHTML = function(src) {
      var key, lvl, pattern, _len, _ref;
      _ref = this.patterns;
      for (key = 0, _len = _ref.length; key < _len; key++) {
        pattern = _ref[key];
        lvl = this.patterns.length - key;
        src = src.replace(pattern, "<h" + lvl + ">$1</h" + lvl + ">");
      }
      return src;
    };
    Markdown.prototype._generatePatterns = function() {
      var hashes, lvl, _i, _len, _ref, _results;
      this.patterns = [];
      _ref = [6, 5, 4, 3, 2, 1];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        lvl = _ref[_i];
        hashes = Array(lvl + 1).join('#');
        _results.push(this.patterns.push(new RegExp("^" + hashes + "\\s?(.*)$", "gm")));
      }
      return _results;
    };
    return Markdown;
  })();
  root = typeof exports !== "undefined" && exports !== null ? exports : window;
  root.Markdown = Markdown;
}).call(this);
