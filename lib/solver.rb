require 'matrix'

# For some reason Ruby matricies aren't mutable
# But apparently there's an easy way to make them so
# *sigh* sometimes I really do miss Python
class Matrix
  public :"[]=", :set_element, :set_component
end

class Solver
  # For test introspection
  attr_reader :matrix, :students, :companies

  # Constraints:
  #   Number of students must equal number of company slots
  #   initial_pairings must be empty
  #
  # Invariants:
  #   Students are rows and companies are columns
  def initialize(students, companies, rankings, initial_pairings=[])
    unless initial_pairings.empty?
      raise ArgumentError.new("Cannot yet handle initial pairings")
    end
    @rankings = rankings

    # Build row and column headers
    # (lists of students and company slots)
    @students = students
    @companies = []
    companies.each do |company|
      # If a company has multiple slots, add that many rows
      company.slots.times do
        @companies << company
      end
    end

    unless @students.length == @companies.length
      raise ArgumentError.new("Number of students (#{@students.length}) does not match number of company slots (#{@companies.length})")
    end

    @matrix = Matrix.build(@students.length, @companies.length) do |row, col|
      initial_cost(row, col)
    end
  end

private
  # What is the initial cost for a student/company pair?
  # Requires @rankings, @students and @companies to have been initialized
  def initial_cost(row, col)



    # Retrieve the ranking for this student-company pair
    ranking = @rankings.find_by(student: @students[row], company: @companies[col])

    if ranking.nil?
      # Students who did not interview with a company are assigned a value of
      # Float::INFINITY, to represent the fact that they cannot intern there.
      # XXX: not sure how this affects performance
      return Float::INFINITY
    end

    # Currently, student preferences and interview results are 1 to 5,
    # with 1 the worst and 5 the best
    #
    # Our intuition about the problem is that there's a small difference
    # between an (incoming) 4 (inclined yes) and a 5 (strong yes),
    # but a large difference between a 2 (inclined no) and a 1 (strong no).
    #
    # To build the cost: subtract each number from 6 (so it's 5 to 1,
    # with 5 the worst and 1 the best) then multiply.
    # TODO DPR: might make sense to adopt this schema gloabally
    return (6 - ranking.student_preference) * (6 - ranking.interview_result)
  end
end


# Sources:
# Hungarian Algorithm:
#   http://www.math.harvard.edu/archive/20_spring_05/handouts/assignment_overheads.pdf
#   http://www.wikihow.com/Use-the-Hungarian-Algorithm
#   https://www.topcoder.com/community/data-science/data-science-tutorials/assignment-problem-and-hungarian-algorithm/
#   http://www.hungarianalgorithm.com/examplehungarianalgorithm.php
#
# Ruby matrix math:
#   http://rubylearning.com/blog/2013/04/04/ruby-matrix-the-forgotten-library/
#   https://ruby-doc.org/stdlib-2.3.0/libdoc/matrix/rdoc/Matrix.html
