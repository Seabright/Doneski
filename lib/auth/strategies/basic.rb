Warden::Strategies.add(:basic) do

  def valid?
    true || params[:username] || params[:password]
  end

  def authenticate!
    use Rack::Auth::Basic.new()
  end
end


