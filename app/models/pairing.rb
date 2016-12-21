class Pairing < ApplicationRecord
  belongs_to :placement
  belongs_to :company
  belongs_to :student

  validates :student, uniqueness: {scope: :placement}
end
