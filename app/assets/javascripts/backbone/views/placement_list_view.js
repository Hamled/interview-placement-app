const PlacementListView = Backbone.View.extend({
  initialize: function() {
    console.log("In PLV.initialize, this.el:")
    console.log(this.el);
    this.placementCardTemplate = _.template($('#placement-card-template').html());
    this.placementCards = [];
    this.placementListElement = this.$('#placement-list')

    this.listenTo(this.model, 'add', this.addPlacementCard);
    this.listenTo(this.model, 'update', this.render);

    // Will trigger a bunch of adds and an update
    this.model.fetch();
  },

  addPlacementCard: function(placement, collection) {
    console.log("Adding card for placement " + placement.id);
    let card = new PlacementCardView({
      model: placement,
      template: this.placementCardTemplate
    });
    this.placementCards.push(card);
    this.listenTo(card, 'select', this.onSelect);
  },

  render: function() {
    console.log("In PLV.render")
    this.placementListElement.empty();
    this.placementCards.forEach(function(card) {
      console.log("Adding HTML:");
      console.log(card.el);
      this.placementListElement.append(card.$el);
    }, this);

    this.delegateEvents();
    return this;
  },

  onSelect: function(placement) {
    this.trigger('select', placement);
  }
});
