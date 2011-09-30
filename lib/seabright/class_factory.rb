module Seabright
  DEBUG = const_defined?(:DEBUG) ? ::DEBUG : false
  class ClassFactory
    def self.setup(classes,namespace=nil)
      (classes.class==Array ? classes : classes.keys).each do |cls|
        sub_class = (namespace ? namespace : Object.const_defined?(:MODEL_NAMESPACE) ? MODEL_NAMESPACE : Object).const_set(cls, Class.new(Seabright::RedisObject)) if !load_from_file(cls)
        if classes[cls] && classes[cls].class==Hash
          classes[cls].each do |k,v|
            puts "#{sub_class.name}: #{k.to_s} = #{v.to_s}" if DEBUG
            sub_class.send(k,v) if sub_class.respond_to?(k)
          end
        end
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