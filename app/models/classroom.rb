class Classroom < ApplicationRecord
  has_many :students
  has_many :companies
  has_many :placements
  belongs_to :creator, class_name: "User"
end
