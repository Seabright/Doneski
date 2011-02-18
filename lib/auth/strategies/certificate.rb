Warden::Strategies.add(:certificate) do

  def valid?
    params[:cert]
  end

  def authenticate!
    false
  end
end