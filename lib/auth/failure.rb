class AuthenticationFailure
  def self.call(env)
    [302, {'Content-Type' => 'text', 'Location'=> 'http://dalwhinnie.local:8080/signin'}, []]
  end
end