let map;
let position = {lat: 44.5013406, lng: -88.0622083};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: position,
    zoom: 15
  });

  //recenter/resize map when browser window is resized.
  google.maps.event.addDomListener(window, 'resize', function() {
    centerMap();
  });
}

//ensures map remains centered, called when hamburger button is clicked or window is resized.
function centerMap() {
  google.maps.event.trigger(map, 'resize');
  map.setCenter(position);
}

//handles any error that might occur when attempting to reach the Google Maps URL.
function errorHandlerGoogeMap() {
  alert('Error retrieving map from Google Maps.')
}

//recenter/resize map when side panel is collapsed
$('#sideContent').on('hidden.bs.collapse', function () {
  centerMap();
});

//recenter/resize map when side panel is shown
$('#sideContent').on('shown.bs.collapse', function () {
  centerMap();
});
