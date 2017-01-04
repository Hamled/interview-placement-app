const PlacementView = Backbone.View.extend({
  initialize: function(options) {
    this.studentBus = new StudentBus();
    this.busDetails = new StudentBusView({
      model: this.studentBus,
      el: this.$('#bus-details')
    });

    this.unplacedStudentsView = new CompanyView({
      model: this.model.unplacedStudents,
      el: this.$('#unplaced-students'),
      bus: this.studentBus
    });

    this.companyViews = [];
    this.companyListElement = this.$('#companies');

    this.model.companies.each(function(company) {
      this.addCompany(company);
    }, this);

    this.listenTo(this.model.companies, 'update', this.render);
    this.listenTo(this.model.companies, 'add', this.addCompany);
  },

  updateScore: function() {
    let score = 0;
    this.model.companies.forEach(function(company) {
      score += company.getScore();
    }, this);
    this.studentBus.set('score', score);
  },

  addCompany: function(company) {
    const companyView = new CompanyView({
      model: company,
      bus: this.studentBus
    });
    this.companyViews.push(companyView);
    this.listenTo(company, 'change', this.updateScore);
  },

  render: function() {
    this.companyListElement.empty();

    this.companyViews.forEach(function(companyView) {
      companyView.$el.addClass('large-4 columns');
      this.companyListElement.append(companyView.el);
    }, this);

    return this;
  }
});
