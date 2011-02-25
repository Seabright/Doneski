module Doneski
  MODELS = {
    :User => {},
    :Task => {},
    :List => {:save_history! => true}
  }
  PAGES = [:signin, :list]
end

require 'seabright/class_factory'
Seabright::ClassFactory.setup(Doneski::MODELS, Doneski)

require 'doneski/page'
require 'doneski/controller'
require 'doneski/router'

