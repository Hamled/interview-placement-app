class Placement < ApplicationRecord
  has_many :pairings
  has_many :students, through: :pairings
  has_many :companies, through: :pairings
end
