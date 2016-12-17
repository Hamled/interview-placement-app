const Student = Backbone.Model.extend({
  initialize: function(options) {
    console.log("Creating student " + options.name);
  }
});
