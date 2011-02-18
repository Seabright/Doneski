module Doneski
  class Signin
    class << self
      def call(env)
        output = ""
        ERB.new(template,0,"","output").result binding
        [200,{"Content-Type" => "text/html"},[output]]
      end
      def title
        @title || "Signin"
      end
      def format
        @format || "html"
      end
      private
      def template
        File.read("views/signin.#{format}.erb") rescue ""
      end
    end
  end
end