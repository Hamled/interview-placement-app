const CompanyView = Backbone.View.extend({
  tagName: 'li',
  initialize: function() {
    console.log('In CompanyView.initialize()');

    // TODO: compile once and share
    this.template = _.template($('#company-template').html());

    this.$el.addClass("company");

    this.render();
  },
  render: function() {
    console.log('In CompanyView.render()');

    const contents = this.template(this.model.attributes)
    this.$el.html(contents);

    this.model.students.forEach(function(student) {
      // TODO: do something
    }, this);

    return this;
  }
})
