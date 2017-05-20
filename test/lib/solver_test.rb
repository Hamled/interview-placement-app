require 'test_helper'

describe Solver do
  describe '#initialize' do
    # TODO DPR: currently these are all in fixtures, maybe look into
    # factorygirl?
    let (:classroom) { Classroom.find_by(name: "solver_test") }

    it "builds a matrix of correct size" do
      s = Solver.new(classroom.students, classroom.companies, classroom.rankings)

      expected_rows = classroom.students.count
      s.matrix.row_count.must_equal expected_rows

      expected_cols = classroom.companies.reduce(0) do |sum, co|
        sum + co.slots
      end
      s.matrix.column_count.must_equal expected_cols
    end

    it "builds a matrix with correct values" do
      s = Solver.new(classroom.students, classroom.companies, classroom.rankings)

      s.matrix.each_with_index do |value, row, col|
        rank = classroom.rankings.find_by(
          student: s.students[row],
          company: s.companies[col]
        )
        if rank.nil?
          value.must_equal Float::INFINITY
        else
          value.must_be :>=, 0
          value.must_be :<=, 24
        end
      end

      puts
      puts s.matrix
      puts
    end

    it "applies the initial reduction" do
      s = Solver.new(classroom.students, classroom.companies, classroom.rankings)
      s.matrix.row_count.times do |r|
        s.matrix.row(r).min.must_equal 0
      end
      s.matrix.column_count.times do |c|
        s.matrix.column(c).min.must_equal 0
      end
    end
  end
end
