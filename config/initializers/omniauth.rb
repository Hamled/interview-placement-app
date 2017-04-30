Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2,
      ENV["GOOGLE_OAUTH_CLIENT_ID"],
      ENV["GOOGLE_OAUTH_CLIENT_SECRET"],
      scope: ['userinfo.email', 'userinfo.profile', 'spreadsheets', 'drive']
end
