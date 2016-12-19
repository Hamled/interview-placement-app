require 'test_helper'

class StudentTest < ActiveSupport::TestCase
  test "Student has companies" do
    assert Student.count > 0
    Student.all.each do |student|
      assert student.companies.size > 0
      student.companies.each do |company|
        assert_kind_of Company, company
      end
    end
  end
end
