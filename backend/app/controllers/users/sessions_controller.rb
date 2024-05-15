class Users::SessionsController < Devise::SessionsController
  before_action :check_email_confirmation, only: [:create]
  respond_to :json

  private

  def check_email_confirmation
    user = User.find_by(email: params[:user][:email])
    unless user&.confirmed_at
      render json: { error: 'Email not confirmed. Please check your email for confirmation instructions.' }, status: :unauthorized
    end
  end

  def respond_with(resource, _opts = {})
    if resource.confirmed_at
      render json: {
        status: {
          code: 200,
          message: "User logged in successfully.",
          email_confirmed: true,
          data: current_user
        }
      }
    else
      render json: {
        status: {
          code: 200,
          message: "User logged in successfully, but email not yet confirmed.",
          email_confirmed: false,
          data: current_user
        }
      }
    end
  end

  def respond_to_on_destroy
    jwt_payload = JWT.decode(request.headers['Authorization'].split(' ')[1], Rails.application.credentials.fetch(:secret_key_base)).first
    current_user = User.find(jwt_payload['sub'])
    if current_user
      render json: {  
        status: 200,
        message: "Signed out successfully."
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "User has no active session."
      }, status: :unauthorized
    end
  end
end
