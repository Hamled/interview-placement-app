class UsersController < ApplicationController
  def auth_callback
    auth_hash = request.env['omniauth.auth']

    user = User.from_omniauth(auth_hash)
    if user.persisted?
      session[:user_id] = user.id

    else
      flash[:status] = :failure
      flash[:message] = "Could not log in"
      flash[:errors] = user.errors.messages

    end
    
    redirect_to root_path
  end

  def logout
  end
end
