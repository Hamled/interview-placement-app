class RenameRankingToPreference < ActiveRecord::Migration[5.0]
  def change
    rename_column :rankings, :student_ranking, :student_preference
    rename_column :classrooms, :student_ranking_spreadsheet, :student_preference_spreadsheet
  end
end
