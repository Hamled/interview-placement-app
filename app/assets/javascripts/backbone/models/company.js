const Company = Backbone.Model.extend({
  defaults: {

  },
  initialize: function() {
    console.log("In Company.initialize()");
    this.students = new StudentCollection();
    this.listenTo(this.students, 'update', this.onStudentsUpdate);
  },

  onStudentsUpdate: function() {
    console.log('In Company.onStudentsUpdate');
    this.trigger('change', this)
  }
})
