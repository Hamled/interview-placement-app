const CompanyView = Backbone.View.extend({
  tagName: 'li',
  initialize: function(options) {
    console.log('In CompanyView.initialize() for ' + this.model.name);

    // TODO: compile once and share
    this.template = _.template($('#company-template').html());
    this.studentTemplate = _.template($('#student-template').html());
    this.emptySlotTemplate = _.template($('#empty-slot-template').html());

    this.bus = options.bus;
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
      template: this.studentTemplate,
      bus: this.bus
    });

    // Add it to our list of cards
    this.cards.push(card);
  },

  removeCard: function(student) {
    this.cards = this.cards.filter(function(card) {
      return card.model != student;
    });
    console.log("Removed student " + student.get('name') + " from company " + this.model.get('name') + ", which now has " + this.model.students.length + " students");
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
      card.delegateEvents();
    }, this);
    console.log(this.studentListElement);

    // Render empty slots
    const emptySlots = this.model.get('slots') - this.model.students.length;
    console.log("Rendering " + emptySlots + " empty slots");
    for (let i = 0; i < emptySlots; i++) {
      this.studentListElement.append(this.emptySlotTemplate());
    }

    return this;
  },

  events: {
    'click .empty.student': 'onClickEmptyStudent'
  },

  onClickEmptyStudent: function(event) {
    let student = this.bus.get('student');
    if (student) {
      console.log("Moving student " + student.name + " into company " + this.model.name);
      student.trigger('move', student, this.model.students);
      this.model.students.add(student);
    } else {
      console.log("No student selected");
    }
  }
})
