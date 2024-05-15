class NotificationMailer < ApplicationMailer
    def send_email(to, subject, message)
      @subject = subject
      @message = message
      mail(to: to, subject: subject) do |format|
        format.html { render 'notification_mailer/send_email' }
      end
    end
  end
  