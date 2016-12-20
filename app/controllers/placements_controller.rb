class PlacementsController < ApplicationController
  before_action :find_placement, only: [:show]

  def index
    @placements = Placement.all
  end

  def show
  end

private
  def find_placement
    begin
      @placement = Placement.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render status: :not_found, content: :false
    end
  end
end
