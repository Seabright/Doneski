require 'rack/mount'

module Doneski
  Routes = Rack::Mount::RouteSet.new do |set|
    set.add_route Page, { :request_method => 'GET', :path_info => %r{^/(?<page>[\w]+)$} }, {}, :page
    set.add_route Controller, { :request_method => 'GET', :path_info => %r{.*} }, {}, :app
  end
end