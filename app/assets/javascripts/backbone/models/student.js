const Student = Backbone.Model.extend({
  defaults: {
    score: 0
  },

  initialize: function(options) {
    this.listenTo(this, 'move', this.onMove);
  },

  onMove: function(student, company) {
    if (student != this) {
      throw "In student.onMove, student was not this";
    }

    let data = this.get('companies')[company.get('name')];
    // data will be undefined if we're moving into
    // the list of unplaced students
    if (data) {
      let score = data.interview_result * data.student_ranking;
      this.set('score', score);
    } else {
      this.set('score', 0);
    }
  }
});
