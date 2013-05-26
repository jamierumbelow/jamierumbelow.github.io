(function() {
  var Application, Cursor, Renderer;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Application = (function() {
    function Application(editor, display) {
      this.el = $(editor);
      this.display = $(display);
      this.renderer = new Renderer(this.el, this.display);
      this.cursor = new Cursor(this.el, this.display);
    }
    Application.prototype.setup = function() {
      this.el.height(window.innerHeight);
      this.renderer.render();
      this.cursor.render();
      this.el.keyup(__bind(function() {
        this.renderer.render();
        return this.cursor.updatePosition();
      }, this));
      return this.el.focus();
    };
    return Application;
  })();
  Renderer = (function() {
    function Renderer(el, display) {
      this.el = el;
      this.display = display;
    }
    Renderer.prototype.render = function() {
      return this.display.html(window.markdown.toHTML(this.el.val()));
    };
    return Renderer;
  })();
  Cursor = (function() {
    function Cursor(editor, display) {
      var fauxchar;
      this.editor = editor;
      this.display = display;
      this.control = this.editor.get(0);
      this.line = this.char = 0;
      this.el = $('<div>&nbsp;</div>').attr('id', 'editor-cursor');
      fauxchar = $('<span>a</span>').appendTo('body');
      this.charwidth = fauxchar.width();
      this.lineheight = parseInt($(fauxchar).css('line-height'));
      fauxchar.remove();
    }
    Cursor.prototype.render = function() {
      this.updatePosition();
      this.el.width(this.charwidth + 2);
      return this.editor.after(this.el);
    };
    Cursor.prototype.updatePosition = function() {
      this.line = this.editor.val().substr(0, this.control.selectionStart).split("\n").length - 1;
      this.char = this.control.selectionStart - this.editor.val().substr(0, this.control.selectionStart).lastIndexOf("\n") - 1;
      return this.el.css({
        "margin-top": "" + (50 + (this.lineheight * this.line) + 5) + "px",
        "margin-left": "" + (this.charwidth * (this.char - 1)) + "px"
      });
    };
    return Cursor;
  })();
  $(function() {
    var app;
    app = new Application('#editor', '#editor-overlay');
    return app.setup();
  });
}).call(this);
