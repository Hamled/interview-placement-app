class AddInterviewReasonToRanking < ActiveRecord::Migration[5.0]
  def change
    add_column :rankings, :interview_result_reason, :string
  end
end
