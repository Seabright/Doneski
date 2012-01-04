require 'seabright'

Seabright.debug! if DEBUG

module Doneski
  PAGES = [:signin, :list, :clean, :about]
  def self.load_resources!
    $favicon = Seabright::Image.from_file("static/images/favicon.png")
    $top = Seabright::Bundle.new(:top,:inline) do
      css 'static/stylesheets/doneski.css'
      css 'static/stylesheets/browser.css'
      css 'static/stylesheets/mobile.css'
      css 'static/stylesheets/orange.css'
      css 'static/stylesheets/orange-mobile.css'
      js 'static/javascripts/journaller.js'
      # js 'static/javascripts/syncer.js'
      js 'static/javascripts/touchyfeely.js'
      js 'static/javascripts/doneski.js'
    end
  end
  def self.inspect
    puts "Favicon: #{$favicon.inspect}"
    puts "Top: #{Seabright::Bundle[:top].inspect}"
  end
end

require 'doneski/page'
require 'doneski/controller'
require 'doneski/sync'
require 'doneski/router'

USE_MINIFIED = !DEBUG
COMPRESS_ASSETS = !DEBUG

Doneski.load_resources! if COMPRESS_ASSETS
