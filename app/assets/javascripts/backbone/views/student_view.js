const StudentView = Backbone.View.extend({
  tagName: 'li',

  initialize: function(options) {
    this.template = options.template;
    this.bus = options.bus;

    // Re-render whenever the model changes
    this.listenTo(this.model, 'change', this.render);

    this.$el.addClass("student");

    // Cards should always be ready to place on the page
    this.render();
  },

  render: function() {
    var contents = this.template(this.model.attributes);
    this.$el.html(contents);

    if (this.model.get('selected')) {
      this.$el.addClass('selected');
    } else {
      this.$el.removeClass('selected');
    }

    this.$el.addClass(Util.classForScore(this.model.get('score')));

    this.$el.draggable({
      start: this.onDragStart.bind(this),
      stop: this.onDragStop.bind(this),
      helper: 'clone',
      snap: '.match .empty.student, #unplaced-students .empty.student',
      snapMode: 'inner',
      snapTolerance: 10,
      revert: 'invalid'
    });

    // Re-bind events
    this.delegateEvents();

    // Enable chained calls
    return this;
  },

  events: {
    'click': 'onClick'
  },

  onClick: function(event) {
    console.log("Student clicked");
    if (!this.bus.hasStudent() ) {
      this.bus.selectStudent(this.model);
      event.stopPropagation();
    }
  },

  onDragStart: function(event) {
    // TODO: when selected, the element is redrawn, removing it from under the mouse!
    this.bus.selectStudent(this.model);
    // this.model.
  },

  onDragStop: function(event) {
    // Stop event triggers *after* the drop event
    if (this.bus.hasStudent()) {
      this.bus.unselectStudent();
    }
  }
})
