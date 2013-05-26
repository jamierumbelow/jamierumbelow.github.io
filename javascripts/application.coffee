# The `Application` class is the main engine behind this cool
# little web markdown editor, and is responsible for rendering the
# initial content, registering all the events to their appropriate
# listeners and handling the live preview.
#
# This class won't work standalone: it depends on markdown-0.4.0.min.js,
# jQuery (2.0.1) and the CSS stylesheet
class Application

  # When instantiating this class, simply pass through two jQuery-compatible
  # selectors: one for the editor <textarea> (filled with the appropriate initial content)
  # and one for the display overlay <div>, which should be empty.
  constructor: ( editor, display ) ->
    @el = $ editor
    @display = $ display

    @renderer = new Renderer @el, @display
    @cursor = new Cursor @el, @display

  # Now we have an instance, we need to call the various related objects and tell them
  # all to go away and do their thing.
  setup: ->

    # Just a quick-fix - set the height of the editor to the height of the page.
    @el.height window.innerHeight

    # Render the initial content
    @renderer.render()
    @cursor.render()

    # Hook up the textbox's keyup event to both the display renderer
    # and the cursor.
    @el.keyup =>
      @renderer.render()
      @cursor.updatePosition()

    # Focus on the textbox
    @el.focus()

# The `Renderer` class is essentially a bridge between the Markdown library and
# the application. Nothing special here.
class Renderer
  constructor: ( @el, @display ) ->

  render: ->
    @display.html window.markdown.toHTML(@el.val())

# Since we're making the <textarea> invisible and overlaying the HTML <div>, we need
# to fake a cursor.
class Cursor
  constructor: ( @editor, @display ) ->
    @control = @editor.get 0
    @line = @char = 0
    @el = $('<div>&nbsp;</div>').attr('id', 'editor-cursor')

    fauxchar = $('<span>a</span>').appendTo('body')
    @charwidth = fauxchar.width()
    @lineheight = parseInt $(fauxchar).css('line-height')
    fauxchar.remove()

  render: ->
    @updatePosition()

    @el.width @charwidth + 2
    @editor.after @el

  updatePosition: ->
    # Rendering the cursor is actually a fair amount more complex than it would seem. We first
    # need to get the character position and then figure out the line based on that. After
    # we have the line, we can get the character IN that line by looking for the LAST newline
    # in the substring between the first character and the start of the selection.
    @line = @editor.val().substr(0, @control.selectionStart).split("\n").length - 1
    @char = @control.selectionStart - @editor.val().substr(0, @control.selectionStart).lastIndexOf("\n") - 1

    # We're using a monospace font, which is the only reason why this works, so we can assume
    # that every character is 1em... so push the cursor the correct number of ems right
    @el.css
      "margin-top": "#{50 + (@lineheight * (@line)) + 5}px"
      "margin-left": "#{(@charwidth * (@char - 1))}px"


# jQuery(document).ready... boot up an instance of Application and run
$ ->
  app = new Application '#editor', '#editor-overlay'
  app.setup()