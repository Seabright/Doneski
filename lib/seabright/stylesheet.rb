module Seabright
  class Stylesheet
    def self.minifies?(paths) !paths.grep(%r[\.css(\?\d+)?$]).empty?; end

    def initialize(content)
      @content = content.nil? ? nil : minify(content)
    end
    
    def minified; @content; end

    def minify(content)
      class << content; include Minifier; end
      content.compress_whitespace.remove_comments.remove_spaces_outside_block.
        remove_spaces_inside_block.trim_last_semicolon.strip
    end

    module Minifier
      def compress_whitespace; compress!(/\s+/, ' '); end
      def remove_comments; compress!(/\/\*.*?\*\/\s?/, ''); end
      def remove_spaces_outside_block
        compress!(/(\A|\})(.*?)\{/) { |m| m.gsub(/\s?([}{,])\s?/, '\1') }
      end
      def remove_spaces_inside_block
        compress!(/\{(.*?)(?=\})/) do |m|
          m.gsub(/(?:\A|\s*;)(.*?)(?::\s*|\z)/) { |n| n.gsub(/\s/, '') }.strip
        end
      end
      def trim_last_semicolon; compress!(/;(?=\})/, ''); end
    private
      def compress!(*args, &block) gsub!(*args, &block) || self; end
    end
  end
end