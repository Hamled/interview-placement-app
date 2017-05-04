// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
$(document).ready(function() {
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
})
