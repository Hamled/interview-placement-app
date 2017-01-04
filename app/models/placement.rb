class Placement < ApplicationRecord
  belongs_to :classroom
  has_many :pairings
  has_many :students, through: :classroom
  has_many :companies, through: :classroom
end
