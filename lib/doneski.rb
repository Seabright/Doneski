module Doneski
  PAGES = [:signin, :list, :clean]
  def self.load_resources
    $doneskifavicon ||= Base64.encode64(IO.read("static/images/doneski.png"))
    $doneskicss ||= Seabright::Stylesheet.new(IO.read('static/stylesheets/doneski.css')).minified
    $orangecss ||= Seabright::Stylesheet.new(IO.read('static/stylesheets/orange.css')).minified
    $doneskijs ||= Closure::Compiler.new.compile(File.open('static/javascripts/doneski.js', 'r'))
  end
end

require 'closure-compiler'
require 'base64'

require 'seabright/stylesheet'

require 'doneski/page'
require 'doneski/controller'
require 'doneski/sync'
require 'doneski/router'

USE_MINIFIED = !DEBUG
COMPRESS_ASSETS = !DEBUG
