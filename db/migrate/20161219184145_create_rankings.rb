class CreateRankings < ActiveRecord::Migration[5.0]
  def change
    create_table :rankings do |t|
      t.belongs_to :student, index: true
      t.belongs_to :company, index: true
      t.integer :student_ranking
      t.integer :interview_result

      t.timestamps
    end
  end
end
