collection @placements
attributes :id, :updated_at
node :student_count do |placement|
  placement.students.length
end
node :company_count do |placement|
  placement.companies.length
end
node :pairing_count do |placement|
  placement.pairings.length
end
