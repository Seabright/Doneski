require 'rack/mount'

module Doneski
  class Manifest
    def self.call(env)
      puts "Serving cache manifest" if DEBUG
      [200,{"Content-Type" => "text/cache-manifest"},[File.read("static/cache.manifest")]]
    end
  end
  Routes = Rack::Mount::RouteSet.new do |set|
    # set.add_route Sync, { :request_method => 'POST', :path_info => %r{^/sync$} }, {}, :sync
    # set.add_route Manifest, { :request_method => 'GET', :path_info => %r{^/cache.manifest$} }, {}, :manifest
    set.add_route Page, { :request_method => 'GET', :path_info => %r{^/about} }, {:layout_name => :static, :page => :about, :title => :About}, :about
    set.add_route Page, { :request_method => 'GET', :path_info => %r{^/(?<page>[\w]+)?$} }, {}, :page
    # set.add_route Ping, { :request_method => 'HEAD', :path_info => %r{^/ping$} }, {}, :ping
    # set.add_route Signup, { :request_method => 'POST', :path_info => %r{^/signup$} }, {}, :signup
    # set.add_route Controller, { :request_method => 'GET', :path_info => %r{.*} }, {}, :app
  end
end