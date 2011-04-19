module Doneski
  class Signup
    require 'yajl'
    require 'redis'
    class << self
      def call(env)
        @req = Rack::Request.new(env)
        redis = Redis.new
        redis.sadd("Doneski::emails",Yajl::Parser.parse(env["rack.input"].read)["email"])
        [200,{"Content-Type" => "text/html"},["Yay!"]]
      end
    end
  end
end