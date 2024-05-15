class Chat < ApplicationRecord
    has_many :memberships , dependent: :destroy
    has_many :messages , dependent: :destroy
    has_one_attached :image
    before_create :slugify

    def slugify
        self.slug = name.parameterize
    end
end         