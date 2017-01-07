const ApplicationView = Backbone.View.extend({
  initialize: function(options) {
    this.classroomData = options.classroomData;

    this.selectElement = this.$('#classroom-select');
    this.listButton = this.$('#toolbar-list-button');
    this.newButton = this.$('#toolbar-new-button');
    this.saveButton = this.$('#toolbar-save-button');

    this.$('#classroom-chooser').hide();
    this.$('#workbench').hide();
    this.placementList = new PlacementSummaryCollection();
    this.placementListView = new PlacementListView({
      model: this.placementList,
      el: this.$('#placement-chooser')
    });
    this.listenTo(this.placementListView, 'select', this.showPlacementWorkbench);

    this.render();
  },

  showPlacementWorkbench: function(placementSummary) {
    console.log("Showing workbench for placement " + placementSummary.id);

    // TODO: clean up properly, don't leak
    this.$('#classroom-chooser').hide();
    this.$('#placement-chooser').hide();
    this.$('#workbench').show();

    this.saveButton.removeClass('disabled');

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
  },

  render: function() {
    // Populate the class selector dropdown
    this.selectElement.empty();
    this.selectElement.append("<option value=\"all\">All</option>");
    this.classroomData.forEach(function(room) {
      this.selectElement.append("<option value=\"" + room.id + "\">" + room.name + "</option>");
    }, this);

    this.delegateEvents();
    return this;
  },

  events: {
    "click #toolbar-list-button": "onClickList",
    "click #toolbar-new-button": "onClickNew",
    "click #toolbar-save-button:not(.disabled)": "onClickSave",
  },

  onClickList: function() {
    let filterId = this.selectElement.val();
    if (filterId != 'all') {
      filterId = Number(filterId);
    }
    console.log("List button clicked, value is " + filterId);
    if (this.placementListView) {
      this.placementListView.filter(filterId);
    }
  },

  onClickNew: function() {
    console.log("New button clicked");
    if (this.selectElement.val() == 'all') {
      console.log("Select a classroom first!");
    }
    let placement = new Placement({
      classroom_id: Number(this.selectElement.val())
    });

    // Send a POST to the server; should give us back an ID
    placement.save(null, {
      fromSave: true,
      success: function(model, response, options) {
        placement.id = response.id;
        console.log("Created placement " + placement.id);

        // Get details (students, companies) from the server
        placement.fetch();

        this.showPlacementWorkbench(placement);
      }
    });
  },

  onClickSave: function() {
    console.log("Save button clicked");
    if (this.workbench) {
      this.workbench.save();
    }
  },
});
