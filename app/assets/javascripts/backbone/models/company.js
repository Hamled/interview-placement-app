const Company = Backbone.Model.extend({
  defaults: {

  },
  initialize: function(options) {
    console.log("In Company.initialize()");
    this.students = options.students || new StudentCollection();

    // Make sure we do proper listener setup on any initial
    // data we were passed
    this.students.forEach(function(student) {
      this.onAdd(student);
    }, this);

    // Pay attention to what the list of students is doing
    this.listenTo(this.students, 'update', this.onStudentsUpdate);
    this.listenTo(this.students, 'add', this.onAdd);
    this.listenTo(this.students, 'remove', this.onRemove);
  },

  onStudentsUpdate: function() {
    console.log('In Company.onStudentsUpdate');
    this.trigger('change', this)
  },

  onAdd: function(student) {
    // Students emit 'move' events when they move to
    // a different list
    console.log("Listening for move events on student " + student.get('name'));
    this.listenTo(student, 'move', this.onMove);
  },

  onRemove: function(student) {
    // Clean up after yourself
    this.stopListening(student, 'move');
  },

  onMove: function(student) {
    // Remove the student from the list without
    // having to destroy it
    console.log("In onMove for student " + student.get('name'));
    this.students.remove(student);
  }
})
