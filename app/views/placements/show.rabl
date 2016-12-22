object @placement
attributes :id
child :students do
  attributes :id, :name
  child :rankings do |ranking|
    attributes :student_ranking, :interview_result, :company_id
  end
end
child :companies do
  attributes :id, :name, :slots
end
