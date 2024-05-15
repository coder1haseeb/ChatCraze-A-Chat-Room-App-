class Users::RegistrationsController < Devise::RegistrationsController
  before_action :validate_email_uniqueness, only: [:create]
  before_action :validate_anonymous_name_uniqueness, only: [:create]
  
  private

  def validate_email_uniqueness
    email_existance = User.find_by(email: sign_up_params[:email])
    if email_existance.present?
      render json: { message: "Email Already in use. Try a new email to sign up." }
    end
  end

  def validate_anonymous_name_uniqueness
    anonymous_name_existance = User.find_by(anonymous_name: sign_up_params[:anonymous_name])
    if anonymous_name_existance.present?
      render json: { message: "Anonymous name already in use. Try a unique anonymous name to sign up." }
    end
  end

  def sign_up_params
    params.require(:user).permit(:first_name, :last_name, :anonymous_name, :gender, :email, :password, :password_confirmation)
  end

  def account_update_params
    params.require(:user).permit(:first_name, :last_name, :anonymous_name, :gender, :email, :password, :password_confirmation, :current_password)
  end

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: {
        status: {
          code: 200,
          message: "Account created Successfully. Please check your email to confirm the process.",
          data: resource,
          email_confirmed: false
        }
      }, status: :ok
    else
      render json: {
        status: {
          message: "User can not be created successfully.",
          errors: resource.errors.full_messages
        }
      }
    end
  end
end
