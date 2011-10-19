module Doneski
  class Sync
    class << self
      def call(env)
        begin
          redis = Redis.new
          redis.select 2
          str = env["rack.input"].read
          redis.zadd("system.log", Time.now.to_i, str)
          dat = Yajl::Parser.parse(str)
          synced = dat["data"].collect do |d|
            data = d[1]
            redis.zadd(key(dat), data[0].to_i, Yajl::Encoder.encode(data))
            d[0]
          end
          out = {:synced => synced, :replay => redis.zrangebyscore(key(dat), dat["lastsync"].to_i, "+inf")}
          puts out.inspect
          [200,{"Content-Type" => "text/plain"},[Yajl::Encoder.encode(out)]]
        rescue
          [500,{"Content-Type" => "text/plain"},[""]]
        end
      end
      def key(data)
        data["account"]
      end
    end
  end
end