class MessagesController < ApplicationController
  # before_action :authenticate_user!  # Assuming user authentication

  # require_relative '../services/ai_suggestion_service'

  def index
    @chat = Chat.find_by(id: params[:chat_id])
    @messages = @chat.messages.all
    serialized_messages = @messages.map do |message|
      @user = User.find_by(id: message.user_id)
      reply_to = nil
      if message.reply_id.present?
        reply = Message.find_by(id: message.reply_id)
        reply_to = {
          id: reply.id,
          message_text: reply.message_text,
          user_name: reply.user.first_name
        }
      end

      {
        id: message.id,
        chat_id: message.chat_id,
        message_text: message.message_text,
        user: {
          id: @user.id,
          first_name: @user.first_name,
          last_name: @user.last_name,
          email: @user.email
        },
        reply_to: reply_to
      }
    end
    render json: serialized_messages
  end

  def create
    @chat = Chat.find_by(id: params[:chat_id])
    @message = @chat.messages.new(message_params)

    if @message.save
      serialized_message = {
        id: @message.id,
        chat_id: @message.chat_id,
        message_text: @message.message_text,
        user: {
          id: @message.user.id,
          first_name: @message.user.first_name,
          last_name: @message.user.last_name,
          email: @message.user.email
        }
      }

      # Check if reply_id is present and fetch the reply message
      if @message.reply_id.present?
        reply = Message.find_by(id: @message.reply_id)
        serialized_message[:reply_to] = {
          id: reply.id,
          message_text: reply.message_text,
          user_name: reply.user.first_name
        }
      end

      ActionCable.server.broadcast("messages_channel", serialized_message)

      render json: @message
    else
      render json: "Message not sent.", status: :unprocessable_entity
    end
  end
  def suggest_message
    render json: "Not allowed."
  end
  
  def destroy
    @message = Message.find(params[:id])
    @message.destroy
    head :no_content
  end

  private

  def message_params
    params.require(:message).permit(:message_text, :user_id, :chat_id, :reply_id)
  end
end
