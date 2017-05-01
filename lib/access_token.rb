# This class mocks up a google authentication manager like
# signet using the access token we got from the omniauth request
class AccessToken
  attr_reader :token
  def initialize(token)
    @token = token
  end

  def apply!(headers)
    headers['Authorization'] = "Bearer #{@token}"
  end
end
