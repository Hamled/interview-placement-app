class SheetsController < ApplicationController
  before_action :require_login

  class AccessToken
    attr_reader :token
    def initialize(token)
      @token = token
    end

    def apply!(headers)
      headers['Authorization'] = "Bearer #{@token}"
    end
  end

  def index

    access_token = AccessToken.new(@current_user.oauth_token)

    # client = Signet::OAuth2::Client.new(
    #   client_id: ENV['GOOGLE_OAUTH_CLIENT_ID'],
    #   client_secret: ENV['GOOGLE_OAUTH_CLIENT_SECRET'],
    #   access_token: @current_user.oauth_token
    # )

    google_sheets = Google::Apis::SheetsV4::SheetsService.new
    google_sheets.authorization = access_token
    spreadsheet_id = "15zuNA4hHCFB83GS3PjKEV_6QoQPdkz8VM9bTRUBIzD0"
    range = "Sheet1!A1:F1"
    response = google_sheets.get_spreadsheet_values(spreadsheet_id, range)
    @planets = response.values[0]
  end
end
