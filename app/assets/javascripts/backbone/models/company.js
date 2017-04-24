const Company = Backbone.Model.extend({
  requireInterview: true,
  defaults: {
  },
  
  initialize: function(attributes, options) {
    if (attributes.students instanceof Backbone.Collection) {
      this.students = attributes.students;
    } else if (attributes.students) {
      this.students = new StudentCollection(attributes.students);
    } else {
      this.students = new StudentCollection();
    }

    if (_.has(options, 'requireInterview')) {
      this.requireInterview = options.requireInterview;
    }

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
    // Trigger a move event first, to let everyone else
    // know who now owns this student
    student.trigger('move', student, this);

    // When someone else takes control of this student,
    // we should remove it from ourselves.
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
      score += student.get('score');
    }, this);
    return score;
  },

  isFull: function() {
    return this.students.length >= this.get('slots');
  },

  canAdd: function(student) {
    // Are there any slots left in this company?
    if (this.isFull()) {
      return false;
    }

    // UnplacedStudents should be the only company which
    // doesn't require an interview. Everyone can go there.
    if (this.requireInterview) {
      // Did the student interview with this company?
      return student.interviewedWith(this);
    }

    return true;
  }
})
