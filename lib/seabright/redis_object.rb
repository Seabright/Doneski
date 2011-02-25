module Seabright
  class RedisObject
    require "redis"
    require "yajl"
    # include AbstractController::Callbacks
    
    def self.inherited(subclass)
       puts "Created new subclass: #{subclass}" if DEBUG
    end

    def self.all
      redis.smembers(self.name.pluralize).collect {|member| self.new(member)}
    end
    
    def self.find(ident)
      self.new(ident)
    end
    
    def self.create(ident)
      obj = self.class.new(ident)
      obj.save
      obj
    end
    
    def self.dump
      out = []
      self.all.each do |obj|
        out << obj.dump
      end
      out.join("\n")
    end
    
    def self.save_history!(v)
      @save_history = v
    end
    
    def self.save_history?
      @save_history || false
    end
    
    def save_history?
      save_history || self.class.save_history?
    end

    def dump
      require "utf8_utils"
      out = ["puts \"Creating: #{id}\""]
      s_id = id.gsub(/\W/,"_")
      out << "a#{s_id} = #{self.class.name}.new(#{actual.to_s.tidy_bytes})"
      @data[:collections].each do |col|
        self[col].each do |sobj|
          out << sobj.dump
          out << "a#{s_id} << a#{sobj.id.gsub(/\W/,"_")}"
        end
      end if @data[:collections]
      out << "a#{s_id}.save"
      out.join("\n")
    end
    
    def store_image
      (@data[:object_history] ||= []).push({:timestamp => Time.now, :snapshot => actual}.to_json)
    end
    
    def actual
      @data.inject({}) {|acc,(k,v)| acc[k] = v if ![:collections, :key].include?(k) && (!@data[:collections] || !@data[:collections].include?(k.to_s)); acc }
    end
    
    def to_json
      Yajl::Encoder.encode(actual)
    end
    
    def initialize(ident = nil, prnt = nil)
      parent = prnt if prnt
      if ident && ident.class == String
        @data = Yajl::Parser.parse(redis.get(key(ident,prnt)) || "{}").symbolize_keys
        @data[id_sym] = ident if !@data[id_sym]
        # parent = if @data && @data[:parent]
      elsif ident && ident.class == Hash
        @data = ident
      end
    end
    
    def key(ident = id, prnt = parent)
      get(:key) || "#{prnt ? "#{prnt.key}:" : ""}#{self.class.name}:#{ident}"
    end
    
    def self.find_by_key(k)
      data = Yajl::Parser.parse(redis.get(k) || "{}").symbolize_keys
      if data
        Object.const_get(data[:class].to_sym).new(data,data[:parent])
      else
        nil
      end
    end
    
    def parent
      @parent ||= self.find_by_key(get(:parent)) || nil
    end
    
    def parent=(obj)
      @parent = obj.class == String ? self.find_by_key(obj) : obj
      @data[:parent] = obj.key
    end
    
    def id
      @data[id_sym] ||= ActiveSupport::SecureRandom.hex(8)
    end

    def save
      @data[:class] = self.class.name
      @data[:key] = key
      store_image if store_history?
      update_timestamps
      redis.set key, Yajl::Encoder.encode(@data)
      redis.sadd(self.class.name.pluralize, id) if !redis.sismember(self.class.name.pluralize, id)
    end
    
    def <<(obj)
      obj.parent = self
      obj.save
      collection = obj.class.name.downcase.pluralize.to_sym
      @data[:collections] ||= []
      @data[:collections] << collection if !@data[:collections].include?(collection)
      @data[collection] ||= []
      @data[collection] << obj.key
    end
    
    def raw
      @data.inspect
    end

    def get(k)
      return nil if !@data
      if @data[:collections] && @data[:collections].include?(k.to_s)
        return @data[k.to_sym].collect {|key| Object.const_get(k.to_s.classify.to_sym).new(key.gsub(/^.*:/,''),self) }
      else
        return @data[k.to_sym] || nil
      end
    end
    alias_method :[], :get

    def set(k,v)
      @data[k.to_s.gsub(/\=$/,'').to_sym] = v
    end

    private
    
    def redis
      Redis.new
    end

    def self.redis
      Redis.new
    end

    def method_missing(sym, *args, &block)
      sym.to_s =~ /=$/ ? set(sym,*args) : get(sym)
    end
    
    def id_sym
      "#{self.class.name.downcase}_id".to_sym
    end
    
    def update_timestamps
      @data[:created_at] = Time.now if !@data[:created_at]
      @data[:updated_at] = Time.now
    end
    
  end
end