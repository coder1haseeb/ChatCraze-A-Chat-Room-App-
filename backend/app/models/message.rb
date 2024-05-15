class Message < ApplicationRecord
    belongs_to :user
    belongs_to :chat
  
    after_create_commit {broadcast_message}
  
    private
    
    def broadcast_message
      
      
      ActionCable.server.broadcast("MessagesChannel", {
        id: id,
        message_text: message_text,
        chat_id: chat_id,
        created_at: created_at,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
        }
        })
    end
      
  end
  