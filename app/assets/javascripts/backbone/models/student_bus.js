const StudentBus = Backbone.Model.extend({
  defaults: {
    // Underscore templates can't infer absent values,
    // so we must explicitly set student to null
    student: null
  },
  selectStudent: function(student) {
    this.set('student', student);
    this.listenTo(student, 'move', this.unselectStudent);
  },
  unselectStudent: function(student) {
    this.stopListening(student, 'move');
    this.set('student', null);
  }
});
