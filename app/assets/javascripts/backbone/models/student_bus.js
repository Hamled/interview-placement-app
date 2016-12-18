const StudentBus = Backbone.Model.extend({
  defaults: {
    // Underscore templates can't infer absent values,
    // so we must explicitly set student to null
    student: null,
    score: 0
  },
  selectStudent: function(student) {
    this.set('student', student);
    student.set('selected', true);
    this.listenTo(student, 'move', this.unselectStudent);
  },
  unselectStudent: function() {
    this.stopListening(this.get('student'), 'move');
    this.get('student').set('selected', false);
    this.set('student', null);
  },
  hasStudent: function() {
    // !! for truthyness
    return !!this.get('student');
  }
});
