require 'test_helper'

describe Solver do
  let (:classroom) { Classroom.find_by(name: "solver_test") }
  let (:solver) { Solver.new(classroom.students, classroom.companies, classroom.rankings) }
  describe '#initialize' do
    # TODO DPR: currently these are all in fixtures, maybe look into
    # factorygirl?


    it "builds a matrix of correct size" do
      expected_rows = classroom.students.count
      solver.matrix.row_count.must_equal expected_rows

      expected_cols = classroom.companies.reduce(0) do |sum, co|
        sum + co.slots
      end
      solver.matrix.column_count.must_equal expected_cols
    end

    it "builds a matrix with correct values" do
      solver.matrix.each_with_index do |value, row, col|
        rank = classroom.rankings.find_by(
          student: solver.students[row],
          company: solver.companies[col]
        )
        if rank.nil?
          value.must_equal Float::INFINITY
        else
          value.must_be :>=, 0
          value.must_be :<=, 24
        end
      end

      puts
      puts solver.matrix
      puts
    end

    it "applies the initial reduction" do
      solver.matrix.row_count.times do |r|
        solver.matrix.row(r).min.must_equal 0
      end
      solver.matrix.column_count.times do |c|
        solver.matrix.column(c).min.must_equal 0
      end
    end
  end

  describe "#solve" do
    it "produces an array" do
      assignments = solver.solve

      puts
      puts "Got assignments back from solver.solve:"
      assignments.each_with_index do |r, c|
        puts "Student #{solver.students[r].name} to company #{solver.companies[c].name}"
      end

      assignments.length.must_equal solver.companies.length

      # no duplicates allowed
      assignments.length.must_equal assignments.uniq.length

      # All values must be in range [0, student_count)
      assignments.each do |r|
        r.must_be :>=, 0
        r.must_be :<, classroom.students.count
      end
    end
  end
end
