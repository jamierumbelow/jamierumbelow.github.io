class Markdown
  toHTML: ( src ) ->
    for lvl in [ 6, 5, 4, 3, 2, 1 ]
      hashes = Array(lvl + 1).join '#'
      pattern = new RegExp "^#{hashes}\\s?(.*)$", "gm"

      src = src.replace pattern, "<h#{lvl}>$1</h#{lvl}>"

    src

root = exports ? window
root.Markdown = Markdown