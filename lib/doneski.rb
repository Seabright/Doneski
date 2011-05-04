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
    @@doneskijs ||= Closure::Compiler.new.compile(File.open('static/javascripts/doneski.js', 'r'))
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
require 'doneski/router'

# COMPRESS_ASSETS = true
# Doneski.load_resources