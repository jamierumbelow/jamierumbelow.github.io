{Markdown} = require '../javascripts/markdown'
chai = require 'chai'

chai.should()

describe 'Markdown Parsing', ->
  before ->
    @markdown = new Markdown

  it 'should parse level 1 headings', ->
    @markdown.toHTML('# Hello World').should.equal '<h1>Hello World</h1>'
    @markdown.toHTML('#Hello, World').should.equal '<h1>Hello, World</h1>'
    @markdown.toHTML('#Hello, World # woo').should.equal '<h1>Hello, World # woo</h1>'

  it "should parse level n headings", ->
    for lvl in [ 2, 3, 4, 5, 6 ]
      hashes = Array(lvl + 1).join '#'
      
      @markdown.toHTML(hashes + ' Hello World').should.equal "<h#{lvl}>Hello World</h#{lvl}>"
      @markdown.toHTML(hashes + 'Hello, World').should.equal "<h#{lvl}>Hello, World</h#{lvl}>"
      @markdown.toHTML(hashes + 'Hello, World # woo').should.equal "<h#{lvl}>Hello, World # woo</h#{lvl}>"