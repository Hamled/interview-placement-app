class Company < ApplicationRecord
  belongs_to :classroom
  has_many :rankings
  has_many :students, through: :rankings
end
