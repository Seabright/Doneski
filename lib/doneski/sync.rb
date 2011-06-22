module Doneski
  class Sync
    def self.call(env)
      puts env["rack.input"].read
      [200,{"Content-Type" => "text/plain"},["999,998"]]
    end
  end
end