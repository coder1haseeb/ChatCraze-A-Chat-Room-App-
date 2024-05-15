class MembershipsController < ApplicationController
  # before_action :authenticate_user!
  def index
    @memberships = current_user.memberships.all.order("created_at")
    serialized_memberships = @memberships.map do |membership|
      @chat = Chat.find_by(id: membership.chat_id)
      next unless @chat # Skip this membership if chat is nil
      
      admin = @chat.admin_id.present? ? User.find_by(id: @chat.admin_id).first_name : nil
      
      {
        membership_id: membership.id,
        chat: {
          id: @chat.id,
          name: @chat.name,
          slug: @chat.slug,
          admin: admin,
          private: @chat.private?,
          inviatable: @chat.invitable,
          image: url_for(@chat.image),
          # last_message: @chat.messages.last,
        }
      }
    end.compact # Remove nil entries from the array
    render json: serialized_memberships
  end
  
  def create
    @chat = Chat.find_by(id: params[:membership][:chat_id])
    if @chat.admin_id == nil
      @chat.update(admin_id: params[:membership][:user_id])
    end
    if @chat.room_password.present? && params[:membership][:room_password].present? && @chat.room_password != params[:membership][:room_password]
      return render json: {
        message: "Incorrect password. Please try again.",
        status: :incorrect
      }
    end
    
    if @chat.memberships.exists?(user_id: params[:membership][:user_id])
      return render json: {
        message: "You have already joined the room.",
        status: 201
      }
    end
    
    @membership = @chat.memberships.new(membership_params)
    
    if @membership.save
      render json: {
        membership: @membership,
        message: "Room joined successfully."
      }
    else
      render json: { error: @membership.errors.full_messages }, status: :unprocessable_entity
    end
  end
  def destroy
    @membership = Membership.find_by(id: params[:id])
    @chat = Chat.find_by(id: @membership.chat_id)
    
    if @membership.nil?
      render json: { message: "Membership not found." }, status: :not_found
      return
    end
    
    # Check if the current user is the admin of the chat
    if @membership.user_id == @chat.admin_id
      new_admin_membership = @chat.memberships.where.not(user_id: @chat.admin_id).order("created_at ASC").first
      if new_admin_membership
        @chat.update(admin_id: new_admin_membership.user_id)
      else
        @chat.update(admin_id: nil) # No other members, set admin to nil
      end
    end
    
    if @membership.destroy
      render json: { message: "Room Left Successfully." }
    else
      render json: { message: "Something went wrong. Try again later." }, status: :unprocessable_entity
    end
  end
  

  private

  def membership_params
    params.require(:membership).permit(:user_id, :chat_id, :room_password)
  end
end
