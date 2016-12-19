class Student < ApplicationRecord
  has_many :rankings
  has_many :companies, through: :rankings
end
