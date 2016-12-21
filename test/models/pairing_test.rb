require 'test_helper'

class PairingTest < ActiveSupport::TestCase
  test "Constructor success" do
    pairing_data = {
      placement: placements(:empty),
      student: students(:no_company),
      company: companies(:no_students)
    }
    Pairing.create!(pairing_data)
  end

  test "Cannot build pairing without placement" do
    pairing_data = {
      student: students(:no_company),
      company: companies(:no_students)
    }
    p = Pairing.create(pairing_data)
    assert_not p.valid?
    assert_includes p.errors.messages, :placement
  end

  test "Cannot build pairing without student" do
    pairing_data = {
      placement: placements(:empty),
      company: companies(:no_students)
    }
    p = Pairing.create(pairing_data)
    assert_not p.valid?
    assert_includes p.errors.messages, :student
  end

  test "Cannot build pairing without company" do
    pairing_data = {
      placement: placements(:empty),
      student: students(:no_company)
    }
    p = Pairing.create(pairing_data)
    assert_not p.valid?
    assert_includes p.errors.messages, :company
  end

  test "Cannot double-place a student in a pairing" do
    pairing_data = {
      placement: placements(:full),
      student: students(:anita),
      company: companies(:no_students)
    }
    p = Pairing.create(pairing_data)
    assert_not p.valid?
    assert_includes p.errors.messages, :student
  end

  # Turns out some companies have multiple slots
  # test "Cannot double-place a company in a pairing" do
  #   pairing_data = {
  #     placement: placements(:full_placement),
  #     student: students(:no_company),
  #     company: companies(:freedom_inc)
  #   }
  #   p = Pairing.create(pairing_data)
  #   assert_not p.valid?
  #   assert_includes p.errors.messages, :student
  # end
end
