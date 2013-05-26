class Markdown
  constructor: ->
    @_generatePatterns()

  toHTML: ( src ) ->
    for pattern, key in @patterns
      lvl = @patterns.length - key
      src = src.replace pattern, "<h#{lvl}>$1</h#{lvl}>"

    src

  _generatePatterns: ->
    @patterns = []

    for lvl in [ 6, 5, 4, 3, 2, 1 ]
      hashes = Array(lvl + 1).join '#'
      @patterns.push new RegExp "^#{hashes}\\s?(.*)$", "gm"

root = exports ? window
root.Markdown = Markdown