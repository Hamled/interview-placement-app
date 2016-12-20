object @placement
attributes :id
child :students do
  attributes :name
end
child :companies do
  attributes :name, :slots
end
