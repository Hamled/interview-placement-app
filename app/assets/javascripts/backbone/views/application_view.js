const ApplicationView = Backbone.View.extend({
  initialize: function(options) {
    this.classroomData = options.classroomData;

    this.selectElement = this.$('#classroom-select');
    this.listButton = this.$('#toolbar-list-button');
    this.newButton = this.$('#toolbar-new-button');
    this.saveButton = this.$('#toolbar-save-button');
    this.undoButton = this.$('#toolbar-undo-button');
    this.redoButton = this.$('#toolbar-redo-button');

    this.placementList = new PlacementSummaryCollection();
    this.placementListView = new PlacementListView({
      model: this.placementList,
      el: this.$('#placement-chooser')
    });
    this.listenTo(this.placementListView, 'select', this.showPlacementWorkbench);

    this.showPlacementList();

    // Listen to key presses on the whole document
    $(document).on('keydown', this.onKeypress.bind(this));

    this.render();
  },

  toggleButtons: function() {
    console.log("in togglebuttons");
    if (this.workbench) {
      this.saveButton.removeClass('disabled');

      // Undo button
      if (this.workbench.canUndo()) {
        this.undoButton.removeClass('disabled');
      } else {
        this.undoButton.addClass('disabled');
      }

      // Redo button
      if (this.workbench.canRedo()) {
        this.redoButton.removeClass('disabled');
      } else {
        this.redoButton.addClass('disabled');
      }

    } else {
      this.saveButton.addClass('disabled');
      this.undoButton.addClass('disabled');
      this.redoButton.addClass('disabled');
    }
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
    "click #toolbar-save-button:not(.disabled)": "onSave",
    "click #toolbar-undo-button:not(.disabled)": "onUndo",
    "click #toolbar-redo-button:not(.disabled)": "onRedo",
  },

  onKeypress: function(event) {
    var code = event.keyCode || event.which;
    var command = event.ctrlKey || event.metaKey;
    if (command && code == 83) {
      // cmd+s -> save
      this.onSave();
      event.preventDefault();

    } else if (command && event.shiftKey && code == 90) {
      // cmd+shift+u -> redo
      this.onRedo()
      event.preventDefault();

    } else if (command && code == 90) {
      // cmd+u -> undo
      this.onUndo();
      event.preventDefault();
    }
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
  },

  onSave: function() {
    console.debug("Save button clicked");
    if (this.workbench) {
      this.workbench.save();
    }
  },

  onUndo: function() {
    console.debug("Undo button clicked");
    if (this.workbench) {
      this.workbench.undo();
    }
  },

  onRedo: function() {
    console.debug("Redo button clicked");
    if (this.workbench) {
      this.workbench.redo();
    }
  }
});
