const Student = Backbone.Model.extend({
  defaults: {
    score: 0,
    selected: false
  },

  initialize: function(attributes, options) {
    this.rankings = new RankingCollection(attributes.rankings);
    this.listenTo(this, 'move', this.onMove);
  },

  onMove: function(student, company) {
    if (student != this) {
      throw "In student.onMove, student was not this";
    }

    var ranking = this.rankings.get(company.id);
    // data will be undefined if we're moving into
    // the list of unplaced students
    if (ranking) {
      var score = ranking.get('interview_result') * ranking.get('student_preference');
      this.set('score', score);
    } else {
      this.set('score', 0);
    }
  },

  scoreFor: function(company) {
    var ranking = this.rankings.get(company.id);
    if (ranking) {
      return ranking.get('interview_result') * ranking.get('student_preference');
    } else {
      return undefined;
    }
  },

  interviewedWith: function(company) {
    return !!this.rankings.get(company.id);
  }
});
