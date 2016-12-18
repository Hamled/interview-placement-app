const StudentBus = Backbone.Model.extend({
  defaults: {
    // Underscore templates can't infer absent values,
    // so we must explicitly set student to null
    student: null,
    score: 0
  },
  selectStudent: function(student) {
    this.set('student', student);
    this.listenTo(student, 'move', this.unselectStudent);
  },
  unselectStudent: function(student, company) {
    this.stopListening(student, 'move');
    this.set('student', null);
  }
});
