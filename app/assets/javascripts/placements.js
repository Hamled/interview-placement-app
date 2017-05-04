// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
console.log("DPR: placements.js loaded")
$(document).ready(function() {
  console.log("DPR: document.ready fired");
  // Only run this if we're on the placements show page
  if ($('#placement-workbench').length) {
    placementDetails = new Placement({
      id: window.placementData["id"]
    });
    placementDetails.parse(window.placementData);
    workbench = new PlacementWorkbenchView({
      model: placementDetails,
      el: '#placement-workbench'
    });
    workbench.render();
  }


  // Only run if we're on the placements index page
  if ($('#placement-chooser').length) {
    placementList = new PlacementSummaryCollection(window.placementList);
    placementListView = new PlacementListView({
      model: placementList,
      el: $('#placement-chooser')
    });
    placementListView.render();
  }
})
