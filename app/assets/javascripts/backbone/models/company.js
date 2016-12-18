const Company = Backbone.Model.extend({
  defaults: {
  },
  initialize: function(options) {
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
    this.trigger('change', this)
  },

  onAdd: function(student) {
    // Students emit 'move' events when they move to a different list
    this.listenTo(student, 'move', this.onMove);
  },

  onRemove: function(student) {
    // Clean up after yourself
    this.stopListening(student, 'move');
  },

  onMove: function(student, toCompany) {
    // Don't bother removing if it's about to get added
    // to us (i.e. the user clicked a company the student
    // was already assigned to). Saves us a bunch of rendering,
    // since nothing will have changed.
    if (toCompany == this) {
      console.log("DPR FLAG");
      return;
    }
    
    // Remove the student from the list without
    // having to destroy it
    this.students.remove(student);
  },

  getScore: function() {
    // Update this company's total score
    let score = 0;
    this.students.forEach(function(student) {
      console.log("Score for " + student.get('name') + ' is ' + student.get('score'));
      score += student.get('score');
    }, this);
    return score;
  }
})
