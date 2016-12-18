const CompanyView = Backbone.View.extend({
  tagName: 'li',
  initialize: function() {
    console.log('In CompanyView.initialize() for ' + this.model.name);
    console.log(this.el);
    console.log(this.model.students)

    // TODO: compile once and share
    this.template = _.template($('#company-template').html());
    this.studentTemplate = _.template($('#student-template').html());
    this.emptySlotTemplate = _.template($('#empty-slot-template').html());

    this.$el.addClass("company");

    this.cards = [];

    console.log('About to add cards for ' + this.model.students.length + ' students');
    this.model.students.forEach(function(student) {
      this.addCard(student);
    }, this);

    // Listen for standard model events
    this.listenTo(this.model.students, 'add', this.addCard);
    this.listenTo(this.model.students, 'remove', this.removeCard);
    this.listenTo(this.model, 'change', this.render);

    this.render();
  },

  addCard: function(student) {
    // Create a new card for the student
    const card = new StudentView({
      model: student,
      template: this.studentTemplate
    });

    // Add it to our list of cards
    this.cards.push(card);
  },

  removeCard: function() {
    // TODO: find the student, stop listening to it, and drop it from the list
  },

  render: function() {
    console.log('In CompanyView.render() for ' + this.model.get('name'));

    const contents = this.template(this.model.attributes)
    this.$el.html(contents);
    this.studentListElement = this.$('.student-list');
    console.log(this.studentListElement);
    this.studentListElement.empty();

    // Render assigned students
    console.log("Rendering " + this.model.students.length + " assigned students");

    // Assumption: cards will re-render themselves as needed
    this.cards.forEach(function(card) {
      console.log(card.el);
      this.studentListElement.append(card.el);
    }, this);
    console.log(this.studentListElement);

    // Render empty slots
    const emptySlots = this.model.get('slots') - this.model.students.length;
    console.log("Rendering " + emptySlots + " empty slots");
    for (let i = 0; i < emptySlots; i++) {
      this.studentListElement.append(this.emptySlotTemplate());
    }

    return this;
  }
})
