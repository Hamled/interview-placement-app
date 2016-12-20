class Ranking < ApplicationRecord
  belongs_to :student
  belongs_to :company

  validates :student, uniqueness: {scope: :company}

  # numericality implies presence: true
  validates :student_ranking, numericality: {
    only_integer: true,
    greater_than: 0,
    less_than_or_equal_to: 5
  }
  validates :interview_result, numericality: {
    only_integer: true,
    greater_than: 0,
    less_than_or_equal_to: 5
  }
end
