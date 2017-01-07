class PlacementsController < ApplicationController
  before_action :find_placement, only: [:show, :update]

  def index
    @placements = Placement.all
  end

  def create
    @placement = Placement.new(placement_create_params)
    if @placement.save()
      render json: {
        id: @placement.id
      }
    else
      render status: :bad_request, json: {
        errors: @placement.errors.messages
      }
    end
  end

  def show
  end

  def update
    begin
      @placement.set_pairings(placement_update_params['pairings'])

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

  def placement_update_params
    params.require(:placement).permit(pairings: [:company_id, :student_id])
  end

  def placement_create_params
    params.require(:placement).permit(:classroom_id)
  end
end
