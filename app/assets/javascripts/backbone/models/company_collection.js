const CompanyCollection = Backbone.Collection.extend({
  model: Company,

  initialize: function(models, options) {
    var students = options.students || [];
    this.unplacedStudents = new Company({
      students: students,
      slots: 24,
      name: "Unplaced Students"
    });
  }
});
