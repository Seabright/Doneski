module Doneski
  class Sync
    def self.call(env)
      str = env["rack.input"].read
      puts str
      puts Yajl::Parser.parse(str).inspect
      [200,{"Content-Type" => "text/plain"},["999,998"]]
    end
  end
end