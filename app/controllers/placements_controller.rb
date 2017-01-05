class PlacementsController < ApplicationController
  before_action :find_placement, only: [:show, :update]

  def index
    @placements = Placement.all
  end

  def show
  end

  def update
    puts "In update, params :"
    params.to_hash.each do |key, value|
      puts "#{key}, #{value}"
    end

    # Remove all existing pairing for this placement,
    # and add in all the new ones.
    # Testing...?
    mutator = placement_params
    puts mutator.to_h

    begin
      @placement.set_pairings(mutator['pairings'])

      puts "Transaction success!"
      render json: {
        errors: []
      }
    rescue ActiveRecord::RecordInvalid => invalid
      puts "Rendering bad request"
      render status: :bad_request, json: {
        errors: invalid.record.errors.messages
      }
    end
  end

private
  def find_placement
    begin
      @placement = Placement.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render status: :not_found, content: false
    end
  end

  def placement_params
    params.require(:placement).permit(pairings: [:company_id, :student_id])
  end

end
