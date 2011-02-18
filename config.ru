$: << File.expand_path(File.dirname(__FILE__))
$: << File.expand_path(File.dirname(__FILE__) + "/lib")

DEBUG = true

require "rubygems"
require "bundler/setup"

require 'auth'
require 'doneski'

require 'rack/mount'

app = Rack::Builder.new do
  
  use Rack::Static, :urls => ["/stylesheets", "/images", "/javascripts"], :root => "static"
  
  use Rack::Session::Cookie, :secret => "9283d6ad6f3a66e74fc57e1dd502eeda1b57f976507bb4cee9f51407750b1d2bcfef283c13c960930a4693a4caed84f503626359d52dba0bca67f7cbb34b3538"
  
  use Warden::Manager do |manager|
    manager.default_strategies :password, :certificate
    manager.failure_app = AuthenticationFailure
  end
  
  run Doneski::Routes
  
end

run app