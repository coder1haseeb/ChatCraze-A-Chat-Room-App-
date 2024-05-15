class ChatsController < ApplicationController
  before_action :authenticate_user!

  def create
    @chat = Chat.new(chat_params)
    if @chat.save
      @membership = Membership.new(user_id: current_user.id, chat_id: @chat.id)
      @membership.save
      render json: {
        chat: {
          admin_id: @chat.admin_id,
          created_at: @chat.created_at,
          updated_at: @chat.updated_at,
          id: @chat.id,
          name: @chat.name,
          private: @chat.private,
          slug: @chat.slug,
          invitable: @chat.invitable,
          image: url_for(@chat.image)
        },
        message: "Chat created Successfully."
      }
    else
      render json: {
        message: "Chat can't be created now. Try again later."
      }
    end
  end
  
  
  def search_chats
    @chats = Chat.where("name LIKE ?", "%#{params[:name]}%").where(invitable: false)
    serialized_chats = @chats.map do |chat|
      user = User.find_by(id: chat.admin_id)
      {
        id: chat.id,
        image: url_for(chat&.image),
        admin_user: {
          id: user&.id,
          first_name: user&.first_name,
          last_name: user&.last_name,
          email: user&.email
        },
        current_user_joined: current_user.memberships.exists?(chat_id: chat.id),
        name: chat.name,
        private: chat.private,
        slug: chat.slug,
        invitable: chat.invitable
      }
    end
    render json: {
      chats: serialized_chats
    }
  end

  def my_chats
    @chats = Chat.where(admin_id: current_user.id)
    serialized_chats = @chats.map do |chat|
      user = User.find_by(id: chat.admin_id)
      {
        id: chat.id,
        admin_user: {
          id: user&.id,
          first_name: user&.first_name,
          last_name: user&.last_name,
          email: user&.email
        },
        image: url_for(chat&.image),
        members: chat.memberships.count,
        name: chat.name,
        private: chat.private,
        slug: chat.slug,
        invitable: chat.invitable
      }
    end
    render json: {
      chats: serialized_chats
    }
  end

  def show_members
    @chat = Chat.find_by(id: params[:id])
    if @chat
      @memberships = @chat.memberships.includes(:user) # Eager load users to avoid N+1 queries
      @members = @memberships.map do |membership|
        user = User.find_by(id: membership.user_id)
        {
          membership_id: membership.id,
          user_id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email
        }
      end
      render json: {
        members: @members
      }
    else
      render json: {
        message: "Chat not found."
      }, status: :not_found
    end
  end
  

  private

  def chat_params
    params.require(:chat).permit(:name, :room_password, :private, :invitable, :admin_id , :image)
  end
end
