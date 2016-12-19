class CreatePairings < ActiveRecord::Migration[5.0]
  def change
    create_table :pairings do |t|
      t.belongs_to :placement, index: true
      t.belongs_to :student
      t.belongs_to :company

      t.timestamps
    end
  end
end
