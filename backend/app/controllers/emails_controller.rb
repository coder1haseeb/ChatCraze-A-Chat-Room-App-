class EmailsController < ApplicationController
  def send_email
    to = params[:to]
    subject = params[:subject]
    message = params[:message]
    NotificationMailer.send_email(to, subject, message).deliver_now
    render json: { message: 'Email sent successfully' }
  end
end
