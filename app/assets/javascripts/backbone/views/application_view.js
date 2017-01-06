const ApplicationView = Backbone.View.extend({
  initialize: function() {
    this.$('#classroom-chooser').hide();
    this.$('#workbench').hide();
    this.placementList = new PlacementSummaryCollection();
    this.placementListView = new PlacementListView({
      model: this.placementList,
      el: this.$('#placement-chooser')
    });
    this.listenTo(this.placementListView, 'select', this.showPlacementWorkbench);
  },

  showPlacementWorkbench: function(placementSummary) {
    console.log("Showing workbench for placement " + placementSummary.id);

    // TODO: clean up properly, don't leak
    this.$('#classroom-chooser').hide();
    this.$('#placement-chooser').hide();
    this.$('#workbench').show();

    // get details about this placement
    placementDetails = new Placement({
      id: placementSummary.id
    });
    placementDetails.fetch();
    this.workbench = new PlacementWorkbenchView({
      model: placementDetails,
      el: '#workbench'
    });
    this.workbench.render();
  }
});
