$: << File.expand_path(File.dirname(__FILE__))
$: << File.expand_path(File.dirname(__FILE__) + "/lib")

DEBUG = File.exists?(File.dirname(__FILE__) + "/.debug")
puts "\e[31m" << "*******  We're in DEBUG mode, gentlemen. *******" << "\e[0m" if DEBUG

require "rubygems"
require "bundler/setup"

require 'doneski'

require 'rack/mount'

app = Rack::Builder.new do
  
  use Rack::Static, :urls => ["/stylesheets", "/images", "/javascripts"], :root => "static"
  
  use Rack::Session::Cookie, :secret => "TritiphamhockbiltongpigporkchoptbonebeefsalamichickenmeatballKielbasajowldrumstickbeefribsfiletmignonbiltongPorkbellyballtipbacontailgroundroundshankDrumstickcornedbeefbiltongpancettaTbone"
  
  run Doneski::Routes
  
end

run app