const PlacementListView = Backbone.View.extend({
  initialize: function() {
    console.log("In PLV.initialize, this.el:")
    console.log(this.el);

    this.bindControls();

    // Do not filter by default
    this.filterId = '';

    this.placementCardTemplate = _.template($('#placement-card-template').html());
    this.placementCards = [];
    this.placementListElement = this.$('#placement-list')

    this.model.each(function(placement) {
      this.addPlacementCard(placement);
    }.bind(this));

    this.listenTo(this.model, 'add', this.addPlacementCard);
    this.listenTo(this.model, 'update', this.render);
  },

  bindControls: function() {
    this.classroomSelect = this.$('#classroom-select');
    this.filterButton = this.$('#toolbar-filter-button');
    this.newButton = this.$('#toolbar-new-button');

    // Get the initial setup
    this.onClassroomSelect();
  },

  addPlacementCard: function(placement, collection) {
    console.log("Adding card for placement " + placement.id);
    let card = new PlacementCardView({
      model: placement,
      template: this.placementCardTemplate
    });
    this.placementCards.push(card);
    // this.listenTo(card, 'select', this.onSelect);
  },

  render: function() {
    console.log("In PLV.render")
    this.placementListElement.empty();
    this.placementCards.forEach(function(card) {
      console.log(card.model.get('classroom_id'));
      console.log(this.filterId);
      if (this.filterId == '' ||
          card.model.get('classroom_id') == this.filterId) {
        this.placementListElement.append(card.$el);
      }
    }, this);

    // Toggle button state
    if (this.filterId == '') {
    } else {

    }

    this.delegateEvents();
    return this;
  },

  events: {
    "click #toolbar-filter-button": "onClickFilter",
    // "click #toolbar-new-button": "onClickNew",
    "change #classroom-select": "onClassroomSelect"
  },

  onClickFilter: function() {
    this.render();
  },

  onClassroomSelect: function() {
    this.filterId = this.classroomSelect.val();
    if (this.filterId == "") {
      this.newButton.addClass('disabled');
      this.newButton.attr('href', 'javascript: void(0)');
    } else {
      this.newButton.removeClass('disabled');
      this.newButton.attr('href', "/classrooms/" + this.filterId + "/placements");
    }
  }
});
