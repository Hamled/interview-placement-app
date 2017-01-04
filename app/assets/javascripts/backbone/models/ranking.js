const Ranking = Backbone.Model.extend({
  parse: function(response, options) {
    // fuck it, don't need names
    // if (!response.name && options.companies) {
    //   response.name = options.companies.at(response.id);
    //   console.log("Successfully looked up name " + response.name + " for company " + response.id);
    // }
    response.id = response.company_id;
    return response;
  }
});
