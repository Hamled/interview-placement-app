const PlacementCardView = Backbone.View.extend({
  tagName: 'li',
  className: 'placement-summary large-3 columns end',

  initialize: function(options) {
    console.log("In cardview.init for placement " + this.model.id);
    this.template = options.template;
    this.render();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    this.delegateEvents();
    return this;
  },

  events: {
    'click': 'select'
  },

  select: function(event) {
    console.log("Clicked on placement " + this.model.id);
    this.trigger('select', this.model);
  }
});
