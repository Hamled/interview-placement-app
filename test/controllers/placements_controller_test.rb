require 'test_helper'

class PlacementsControllerTest < ActionController::TestCase
  test "Get list of placements" do
    get :index
    assert_response :success
    data = JSON.parse(@response.body)

    assert_equal Placement.count, data.length
  end

  test "Show a real placement" do
    get :show, params: {id: placements(:full).id}
    assert_response :success
    data = JSON.parse(@response.body)

    assert_includes data, 'students'
    assert_equal data['students'].length, placements(:full).students.count
    assert_includes data, 'companies'
    assert_equal data['companies'].length, placements(:full).companies.count
  end

  test "Show a placement that D.N.E." do
    bogus_placement_id = 1337
    assert_nil Placement.find_by(id: bogus_placement_id)
    get :show, params: {id: bogus_placement_id}
    assert_response :not_found
  end
end
