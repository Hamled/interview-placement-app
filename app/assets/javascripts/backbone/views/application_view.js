const ApplicationView = Backbone.View.extend({
  initialize: function(options) {
    this.classroomData = options.classroomData;

    this.selectElement = this.$('#classroom-select');
    this.listButton = this.$('#toolbar-list-button');
    this.newButton = this.$('#toolbar-new-button');

    this.placementList = new PlacementSummaryCollection();
    this.placementListView = new PlacementListView({
      model: this.placementList,
      el: this.$('#placement-chooser')
    });
    this.listenTo(this.placementListView, 'select', this.showPlacementWorkbench);

    this.showPlacementList();


    this.render();
  },



  showPlacementList: function() {
    console.log("Showing placement list");

    this.$('#classroom-chooser').hide();
    this.$('#workbench').hide();
    this.$('#placement-chooser').show();

    this.toggleButtons();
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
    placementDetails.fetch({
      success: function() {
        this.workbench = new PlacementWorkbenchView({
          model: placementDetails,
          el: '#workbench'
        });
        this.workbench.render();

        this.toggleButtons();
        this.listenTo(this.workbench, 'student-move', this.toggleButtons)
      }.bind(this)
    });
  },

  render: function() {
    // Populate the class selector dropdown
    this.selectElement.empty();
    this.selectElement.append("<option value=\"all\">All</option>");
    this.classroomData.forEach(function(room) {
      this.selectElement.append("<option value=\"" + room.id + "\">" + room.name + "</option>");
    }, this);

    this.toggleButtons();

    this.delegateEvents();
    return this;
  },

  events: {
    "click #toolbar-list-button": "onClickList",
    "click #toolbar-new-button": "onClickNew",
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

    this.showPlacementList();
  },

  onClickNew: function() {
    console.log("New button clicked for classroom " + this.selectElement.val());
    if (this.selectElement.val() === 'all') {
      alert("Select a classroom first!");
      return;
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

        this.showPlacementWorkbench(placement);
      }.bind(this)
    });
  }
});
