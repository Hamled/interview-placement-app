class Placement < ApplicationRecord
  belongs_to :classroom
  has_many :pairings
  has_many :students, through: :classroom
  has_many :companies, through: :classroom

  # Replace all pairings for this placement
  #
  # new_pairings should be an array of pairings, of form
  #   [ { company_id: 123, student_id: 456 }, ... ]
  #
  # If new_pairings is omitted, all current pairings
  #   will be destroyed.
  #
  # Will rollback and throw an ActiveRecord::RecordInvalid
  #   if any of the pairings is invalid.
  #
  # Returns an ActiveRecord::Collection representing
  #   this placement's pairings
  def set_pairings(new_pairings=[])
    self.transaction do
      self.pairings.destroy_all
      new_pairings.each do |pair|
        # AR will rollback when an exception is thrown
        self.pairings.create! pair
      end
    end
    return self.pairings
  end

  def self.build(options)
    p = self.new(options)
    unless p.name
      p.name = Faker::Food.ingredient
    end
    return p
  end
end
