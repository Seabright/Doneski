module Seabright
  class ClassFactory
    require 'seabright/redis_object'
    def self.setup(classes,namespace=nil)
      classes.each do |cls|
        sub_class = (namespace ? namespace : Object.const_defined?(:MODEL_NAMESPACE) ? MODEL_NAMESPACE : Object).const_set(cls, Class.new(Seabright::RedisObject)) if !load_from_file(cls)
        puts "Initialized: #{sub_class.inspect}" if DEBUG
      end
    end
    
    private
    def self.load_from_file(cls)
      begin
        require "models/#{cls.to_s}"
      rescue LoadError
        false
      end
    end
  end
end