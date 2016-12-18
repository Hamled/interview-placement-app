const PlacementView = Backbone.View.extend({
  initialize: function(options) {
    console.log("In PlacementView.initialize");
    console.log(this.el);

    this.unplacedStudentsView = new UnplacedStudentsView({
      model: options.unplacedStudents,
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
      model: company
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
      this.companyListElement.append(companyView.el);
    }, this);

    return this;
  },

  events: {

  }
});
