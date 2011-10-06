module Doneski
  MODELS = {
    :User => {},
    :Task => {},
    :List => {:save_history! => true}
  }
  PAGES = [:signin, :list]
  def self.load_resources
    @@doneskifavicon ||= Base64.encode64(IO.read("static/images/doneski.png"))
    @@doneskicss ||= Seabright::Stylesheet.new(IO.read('static/stylesheets/doneski.css')).minified
		@@papercss ||= Seabright::Stylesheet.new(IO.read('static/stylesheets/paper.css')).minified
    @@doneskijs ||= Closure::Compiler.new.compile(File.open('static/javascripts/doneski.js', 'r'))
  	@@touchyjs ||= Closure::Compiler.new.compile(File.open('static/javascripts/touchyfeely.js', 'r'))
  end
end

require 'closure-compiler'
require 'base64'

require 'seabright/class_factory'
require 'seabright/stylesheet'
Seabright::ClassFactory.setup(Doneski::MODELS, Doneski)

require 'doneski/page'
require 'doneski/signup'
require 'doneski/controller'
require 'doneski/ping'
require 'doneski/sync'
require 'doneski/router'

USE_MINIFIED = false
COMPRESS_ASSETS = false
# Doneski.load_resources
