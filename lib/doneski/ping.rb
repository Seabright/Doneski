module Doneski
  class Ping
    def self.call(env)
      [200,{"Content-Type" => "text/pong"},[]]
    end
  end
end