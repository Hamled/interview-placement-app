class MainController < ApplicationController
  def index
    @classrooms = Classroom.all
  end
end
