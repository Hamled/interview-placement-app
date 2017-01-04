class MakeClassroomOwnThings < ActiveRecord::Migration[5.0]
  def change
    add_reference :placements, :classroom, foreign_key: true
    add_reference :students, :classroom, foreign_key: true
    add_reference :companies, :classroom, foreign_key: true
  end
end
