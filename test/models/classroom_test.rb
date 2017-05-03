require 'test_helper'

describe Classroom do
  describe "relations" do
  end

  describe "purge" do
    it "blows away everything" do
      classroom = classrooms(:jets)
      classroom.pairings.count.must_be :>, 0
      classroom.placements.count.must_be :>, 0
      classroom.rankings.count.must_be :>, 0
      classroom.companies.count.must_be :>, 0
      classroom.students.count.must_be :>, 0

      classroom.purge
      classroom.reload

      classroom.pairings.count.must_equal 0
      classroom.placements.count.must_equal 0
      classroom.rankings.count.must_equal 0
      classroom.companies.count.must_equal 0
      classroom.students.count.must_equal 0
    end
  end

  describe "from_spreadsheets" do
  end
end
