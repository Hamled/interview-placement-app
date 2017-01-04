const CompanyView = Backbone.View.extend({
  tagName: 'li',
  initialize: function(options) {
    // TODO: compile once and share
    this.template = _.template($('#company-template').html());
    this.studentTemplate = _.template($('#student-template').html());
    this.emptySlotTemplate = _.template($('#empty-slot-template').html());

    this.bus = options.bus;
    this.listenTo(this.bus, 'select', this.showMatchQuality)
    this.listenTo(this.bus, 'unselect', this.hideMatchQuality)

    this.cards = [];
    this.model.students.forEach(function(student) {
      this.addCard(student);
    }, this);

    // Listen for standard model events
    this.listenTo(this.model.students, 'add', this.addCard);
    this.listenTo(this.model.students, 'remove', this.removeCard);
    this.listenTo(this.model, 'change', this.render);

    this.render();
  },

  showMatchQuality: function(student) {
    const score = student.scoreFor(this.model);

    // Clear any existing score display
    this.hideMatchQuality();

    // score will be undefined (falsey) if the student
    // didn't interview at this company
    if (score) {
      this.$el.addClass(Util.classForScore(score));
    }
  },

  hideMatchQuality: function() {
    Util.removeScoreClasses(this.el);
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
  },

  render: function() {
    console.debug('In CompanyView.render() for ' +
                this.model.get('name') +
                " (id " + this.model.id + ")");

    const contents = this.template(this.model.attributes)
    this.$el.html(contents);
    this.studentListElement = this.$('.student-list');
    this.studentListElement.empty();

    // Render assigned students
    // Assumption: cards will re-render themselves as needed
    this.cards.forEach(function(card) {
      this.studentListElement.append(card.el);
      card.delegateEvents();
    }, this);

    // Render empty slots
    const emptySlots = this.model.get('slots') - this.model.students.length;
    for (let i = 0; i < emptySlots; i++) {
      this.studentListElement.append(this.emptySlotTemplate());
    }

    return this;
  },

  events: {
    'click': 'onClick'
  },

  onClick: function(event) {
    let student = this.bus.get('student');
    if (student) {
      // Click on the company the student is already in
      // -> unselect, even if this company is full
      if (this.model.students.contains(student)) {
        this.bus.unselectStudent();
        return;
      }

      // Go no further if the student can't be added
      // to this company for any reason
      if (!this.model.canAdd(student)) {
        return;
      }

      console.log("Moving student " + student.get('name') + " into company " + this.model.get('name'));
      // The move has to come before the add - that way the
      // student has a chance to update its score before
      // the 'add' event bubbles up to the PlacementView
      student.trigger('move', student, this.model);
      this.model.students.add(student);
    } else {
      console.log("No student selected");
    }
  }
})
