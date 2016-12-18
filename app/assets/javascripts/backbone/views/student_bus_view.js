const StudentBusView = Backbone.View.extend({
  initialize: function(options) {
    this.template = _.template($('#bus-details-template').html());
    this.listenTo(this.model, 'change', this.render);
    this.render();
  },
  render: function() {
    console.log("In BusView.render()");
    console.log(this.model);
    console.log(this.model.get('student'));
    this.$el.html(this.template(this.model.attributes));
    return this;
  }
});
