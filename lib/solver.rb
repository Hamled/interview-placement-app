# Solve a placement, to give a starting point for
# instructors to work from
# Currently implements the Hungarian Algorithm,
# see references at the bottom of this file

require 'matrix'

# For some reason Ruby matricies aren't mutable
# But apparently there's an easy way to make them so
# *sigh* sometimes I really do miss Python
class Matrix
  public :"[]=", :set_element, :set_component
end

# Safety checks for myself
class ProgrammingError < StandardError; end

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

    initial_reduction
  end

  def solve
    # Find the maximum matching, that is, a set of assignments
    # using the current reduced matrix. The slots in the array
    # represent companies (columns), and the values represent
    # students (rows). -1 means the company has no student assigned
    assignments = maximum_matching

    # Safety: outside of -1, there should be no duplicate assignments
    real_assignments = assignments.select { |a| a >= 0 }
    if real_assignments.length != real_assignments.uniq.length
      raise ProgrammingError("maximum_matching returned a duplicate value in the assignment array: #{assignments}")
    end

    # If every company has a student assigned, we're done
    return assignments unless assignments.include? -1

    # OK, we're not done yet. Need to reduce the matrix,
    # then go again.
    # To reduce the matrix, we first convert our maximum matching
    # into a minimum vertex cover using Koning's graph theorem
  end

private

  #
  # Initialization
  #

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

  def initial_reduction
    # For each row, subtract the smallest cost from each element
    # Then repeat for columns

    # r and c are row and column indicies
    # row and column are actual vectors

    # Reduce rows
    puts ">>> rows"
    @matrix.row_count.times do |r|
      min = @matrix.row(r).min
      puts "reducing row #{r} by #{min}"
      if min > 0
        @matrix.column_count.times do |c|
          @matrix[r,c] -= min
        end
      end
    end

    # Reduce columns
    puts ">>> cols"
    @matrix.column_count.times do |c|
      min = @matrix.column(c).min
      puts "reducing col #{c} by #{min}"
      if min > 0
        @matrix.row_count.times do |r|
          @matrix[r,c] -= min
        end
      end
    end
  end

  #
  # Maximum matching
  #

  # Recursive subroutine based on DFS, that finds an assignment
  # for the student in row r if possible
  def find_match(flow_graph, r, seen, assignments)
    # try each company, one by one
    flow_graph.column_count.times do |c|
      # If this student-company pairing is a candidate, and
      # we haven't yet examined this company
      if flow_graph[r,c] and not seen(c)
        # Mark this company as seen
        seen(c) = true

        # If company c has no assigned student, or if
        # the currently assigned student can be switched
        # to a different company, we assign the student
        # to this company and call it good
        if assignments[c] < 0 or find_match(flow_graph, assignments[c], seen, assignments)
          assignments[c] = r
          return true
        end
      end
    end
    return false
  end

  # A matching is a set of edges (pairings) without any common
  # vertices (students or companies). A maximum matching is a
  # matching that contains the largest possible number of vertices.
  #
  # In this context, we're finding the maximum matching for our
  # matrix as it has been reduced so far, that is, including only
  # pairing where the current value is 0.
  #
  # To do so, we convert the matrix to a flow graph and use
  # a variant on the Ford-Fulkerson algorithm to find the
  # maximum matching.
  #
  # See http://www.geeksforgeeks.org/maximum-bipartite-matching/
  def maximum_matching
    # Build a flow graph from our current cost graph
    flow_graph = Matrix.build(@matrix.row_count) do |row, col|
      @matrix[row, col] == 0
    end

    # Array to keep track of which student is assigned to which company
    # The value of assignments[c] is the student number s
    # assigned to company c, or -1 if no one is assigned
    assignments = [-1] * @flow_graph.column_count

    flow_graph.row_count.times do |r|
      # Array to keep track of which companies
      # have been seen while attempting to place this student
      seen = [false] * @flow_graph.column_count

      find_match(flow_graph, r, seen, assignments)
    end

    return assignments
  end

  #
  # Minimum vertex cover
  #

  # Implementation of the algorithm described by Konig's Theorem
  # https://en.wikipedia.org/wiki/K%C5%91nig%27s_theorem_(graph_theory)#Proof
  def minimum_vertex_cover(flow_graph, assignments)
    # Konig's theorm indicates that, given:
    #   a bipartate graph G, with vertices partitioned into students S and companies C,
    #     and edges E (all of which currently have cost 0, or are marked true in the flow graph)
    #   a maximum matching M (a subset of the edges in E),
    # a minim vertex cover K can be constructed via the following technique:
    #
    # Let S' be the (possible empty) set of students in S not connected by M
    # Define an alterating path as a path that alternates between
    #   edges in M and those not in M (doesn't matter which you start on)
    # Let S* be the set of students in S that are either in S', or can
    #   be reached by following an alternating path from S' (a superset of S')
    # Let C* be the set of companies in C that can be reached by such a path from S'
    # Then the MVC K can be defined as the union of students not in S* and companies in C*
    #
    # More formally:
    # S' = { s in S not connected by M }
    # S* = S' U { s in S reachable by an alternating path from S' }
    # C* = { c in C reachable by an alternating path from S' }
    # then
    # K = ( S - S* ) U C*
    #
    # How do we find vertices in S* and C*? BFS or DFS, of course!

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
#
# Finding a maximum matching:
#   http://www.geeksforgeeks.org/maximum-bipartite-matching/
