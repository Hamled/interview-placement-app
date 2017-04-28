const PlacementWorkbenchView = Backbone.View.extend({
  initialize: function(options) {
    this.studentBus = new StudentBus();
    this.busDetails = new StudentBusView({
      model: this.studentBus,
      el: this.$('#bus-details')
    });
    this.undoManager = new Backbone.UndoManager();

    this.undoManager.register(this.model.unplacedStudents.students);
    this.unplacedStudentsView = new CompanyView({
      model: this.model.unplacedStudents,
      el: this.$('#unplaced-students'),
      bus: this.studentBus
    });

    this.companyViews = [];
    this.companyListElement = this.$('#companies');

    this.model.companies.each(function(company) {
      this.undoManager.register(company.students);
      this.addCompany(company);
    }, this);

    this.listenTo(this.model.companies, 'update', this.render);
    this.listenTo(this.model.companies, 'add', this.addCompany);

    this.undoManager.startTracking();
  },

  onCompanyChange: function() {
    // update scores
    let score = 0;
    this.model.companies.forEach(function(company) {
      score += company.getScore();
    }, this);
    this.studentBus.set('score', score);

    // Trigger a global "student-move" event for anyone
    // who's listening (the ApplicationView)
    this.trigger('student-move')
  },

  addCompany: function(company) {
    const companyView = new CompanyView({
      model: company,
      bus: this.studentBus
    });
    this.companyViews.push(companyView);
    this.listenTo(company, 'change', this.onCompanyChange);
  },

  render: function() {
    this.companyListElement.empty();

    this.companyViews.forEach(function(companyView) {
      companyView.$el.addClass('large-4 columns');
      this.companyListElement.append(companyView.el);
    }, this);

    return this;
  },

  save: function() {
    console.debug("Saving placement");
    result = this.model.save(null, { fromSave: true });
    console.log(result);
  },

  undo: function() {
    console.debug("Undoing action");

    // Undo twice: once for selecting the student, and once for the move
    // TODO DPR: figure out why the undomanager is picking
    // up the student select, since I only registered the collections
    this.undoManager.undo(true);
    this.undoManager.undo(true);
  },

  redo: function() {
    console.debug("Redoing action");

    // As above, need to fire twice
    this.undoManager.redo(true);
    this.undoManager.redo(true);
  },

  canUndo: function() {
    return this.undoManager.isAvailable('undo');
  },

  canRedo: function() {
    return this.undoManager.isAvailable('redo');
  }
});
