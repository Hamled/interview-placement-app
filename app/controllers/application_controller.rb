class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :lookup_user

private
  def lookup_user
    if session[:user_id]
      @current_user = User.find_by(id: session[:user_id])
    end
  end

  def require_login
    lookup_user
    if @current_user.nil?
      flash[:status] = :failure
      flash[:message] = "You must be logged in to see this page"
      redirect_to root_path
    end
  end
end
