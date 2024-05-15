class AddReplyIdToMessages < ActiveRecord::Migration[7.1]
  def change
    add_column :messages, :reply_id, :integer
  end
end
