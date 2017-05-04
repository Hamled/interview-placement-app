class AddNameToPlacement < ActiveRecord::Migration[5.0]
  def change
    add_column :placements, :name, :string
  end
end
