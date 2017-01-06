const ApplicationView = Backbone.View.extend({
  initialize: function() {
    console.log("in ApplicationView.initialize");
    console.log(this.el);
    console.log(this.$('#placement-chooser'));
    this.placementList = new PlacementSummaryCollection();
    this.placementListView = new PlacementListView({
      model: this.placementList,
      el: this.$('#placement-chooser')
    });
    this.listenTo(this.placementListView, 'select', this.showPlacementWorkbench);
  },

  showPlacementWorkbench: function(placementSummary) {
    console.log("Showing workbench for placement " + placementSummary.id);
    if (this.workbench) {
      // If we're already in the workbench, un-render the
      // current view and detach it from the DOM.
      // TODO: Make sure this is cleaned up right, and
      // we're not leaking a bunch of memory
      this.workbench.remove();
      this.workbench = undefined;
    }

    if (this.placementList) {
      // remove but don't destroy the placement list
      this.placementList.remove();
    }

    // get details about this placement
    placementDetails = new Placement({
      id: placementSummary.id
    });
    placementDetails.fetch();
    this.workbench = new PlacementWorkbenchView({
      model: placementDetails,
      el: '#placement-workbench'
    });
    this.workbench.render();
  }
});
