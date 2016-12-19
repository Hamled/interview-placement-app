class Company < ApplicationRecord
  has_many :rankings
  has_many :students, through: :rankings
end
