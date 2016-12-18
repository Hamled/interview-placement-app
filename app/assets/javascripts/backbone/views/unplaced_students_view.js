const UnplacedStudentsView = Backbone.View.extend({
  initialize: function(options) {
    console.log("in UnplacedStudents.initialize()");
    console.log(this.el);

    console.log("student count: " + this.model.length)

    this.cards = [];
    this.studentListElement = this.$('.student-list');

    this.model.forEach(function(student) {
      this.addCard(student);
    }, this);

    // Listen for standard model events
    this.listenTo(this.model, 'add', this.addCard);
    this.listenTo(this.model, 'remove', this.removeCard);
    this.listenTo(this.model, 'update', this.render);

    this.render();
  },

  addCard: function(student) {
    // Create a new card for the student
    const card = new StudentView({
      model: student
    });

    // Add it to our list of cards
    this.cards.push(card);
  },

  removeCard: function() {
    // TODO
  },

  render: function() {
    console.log("in UnplacedStudents.render()");

    this.studentListElement.empty();

    // Assumption: cards will re-render themselves as needed
    this.cards.forEach(function(card) {
      this.studentListElement.append(card.el);
    }, this);

    return this;
  },

  events: {

  },
});
