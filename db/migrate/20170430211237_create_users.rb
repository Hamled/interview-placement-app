class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :oauth_provider
      t.string :oauth_uid
      t.string :name
      t.string :email
      t.string :oauth_token
      t.datetime :token_expires_at
      t.timestamps
    end
  end
end
