module Doneski
  class Controller
    def self.call(env)
      puts Rack::Request.new(env).params
      # env['warden'].authenticate!
      [200,{"Content-Type" => "text/plain"},["Yay!","\n\n\nAuthenticated? ",env['warden'].authenticated?.to_s]]
    end
    # def call(env)
    #   puts
    #   [200,{"Content-Type" => "text/plain"},["Yay!"]]
    # end
  end
end