module Doneski
  class Page
    DEFAULTS = {
      :format => "html",
      :page => "list",
      :layout_name => "default",
      :title => "Signin"
    }
    class << self
      def call(env)
        @params = Rack::Request.new(env).params.merge(env["rack.routing_args"]).inject({}){|acc,(k,v)| acc[k.to_sym] = v; acc}
        @params[:page] ||= DEFAULTS[:page]
        return Controller.call(env) if !PAGES.include?(@params[:page].to_sym)
        output = ""
        ERB.new(template,0,"","output").result(binding)
        [200,{"Content-Type" => "text/html"},[layout{output}]]
      end
      def method_missing(sym, *args, &block)
        @params[sym] || DEFAULTS[sym] || ""
      end
      def format
        @params[:format] || DEFAULTS[:format]
      end
      private
      def layout
        out = ""
        ERB.new(File.read("views/layouts/#{layout_name}.#{format}.erb"),0,"","out").result(binding)
        out
      end
      def template
        File.read("views/#{page}.#{format}.erb") rescue ""
      end
    end
  end
end