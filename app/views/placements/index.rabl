collection @placements
attributes :id, :updated_at, :classroom_id
node :student_count do |placement|
  placement.students.length
end
node :company_count do |placement|
  placement.companies.length
end
node :pairing_count do |placement|
  placement.pairings.length
end
