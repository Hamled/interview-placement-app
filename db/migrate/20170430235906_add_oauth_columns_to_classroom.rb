class AddOauthColumnsToClassroom < ActiveRecord::Migration[5.0]
  def change
    add_reference :classrooms, :creator, references: :users, index: true
    add_foreign_key :classrooms, :users, column: :creator_id
    add_column :classrooms, :interview_result_spreadsheet, :string
    add_column :classrooms, :student_ranking_spreadsheet, :string
  end
end
