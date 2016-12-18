const PlacementView = Backbone.View.extend({
  initialize: function(options) {
    console.log("In PlacementView.initialize");
    console.log(this.el);

    console.log(options.unplacedStudents)
    this.unplacedStudents = new Company({
      students: options.unplacedStudents,
      slots: 24,
      name: "Unplaced Students"
    });
    this.unplacedStudentsView = new CompanyView({
      model: this.unplacedStudents,
      el: this.$('#unplaced-students')
    });

    this.companyViews = [];
    this.companyListElement = this.$('#companies');

    this.model.each(function(company) {
      this.addCompanyView(company);
    }, this);

    this.listenTo(this.model, 'update', this.render);
    this.listenTo(this.model, 'add', this.addCompanyView);
    this.listenTo(this.model, 'remove', this.removeCompanyView);
  },

  addCompanyView: function(company) {
    const companyView = new CompanyView({
      model: company,
    });
    this.companyViews.push(companyView);
  },

  removeCompanyView: function (company) {
    // TODO
  },

  render: function() {
    console.log("in PlacementView.render()")

    this.companyListElement.empty();

    this.companyViews.forEach(function(companyView) {
      companyView.$el.addClass('large-4 columns');
      this.companyListElement.append(companyView.el);
    }, this);

    return this;
  },

  events: {

  }
});
