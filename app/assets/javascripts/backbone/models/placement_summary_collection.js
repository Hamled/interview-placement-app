const PlacementSummaryCollection = Backbone.Collection.extend({
  model: PlacementSummary,
  url: 'http://localhost:3000/placements/'
});
