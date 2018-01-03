/* ======= Model ======= */

class Location {
  constructor(name, lat, lng, placeId) {
    this.name = ko.observable(name);
    this.isSelected = ko.observable(false);
    this.placeId = placeId;
    this.marker = {
      title: name,
      map: null,
      animation: null,
      position: {
          lat: lat,
          lng: lng
      }
    };
  }
}

let selectedLocation = null;
let locations = [
    new Location("Lambeau Field", 44.5013406, -88.0622083, "ChIJDxtU2VH6AogR3dxDyAGAgkU")
  , new Location("Don Hudson Center", 44.4982522,-88.05724300000003, "ChIJXQC2C1P6AogRJJeEszaKQd0")
  , new Location("Hall of Fame", 44.50175470000001,-88.0604447, "ChIJgYhGFjf7AogRDJ9W5lJonZU")
  , new Location("Hinterland Brewery", 44.50326189999999,-88.06424670000001, "ChIJfz3ABE_6AogR6dju5c2qW_A")
  , new Location("Lodge Kohler", 44.5020925,-88.0654606, "ChIJBfOdwE76AogRheTI9Eay6bw")
  , new Location("Resch Center", 44.4995277,-88.05490320000001, "ChIJUZRp5VP6AogR4it2XAyhfs4")
];

/* ======= ViewModel ======= */

class LocationsViewModel {
  constructor() {
    this.filteredLocations = ko.observableArray();
    this.infoWindow = new google.maps.InfoWindow();
    this.applyFilter();
  }

  setSelectedItem(location) {
    //unselect currently selected location
    this.filteredLocations().forEach(location => location.isSelected(false));

    //set the newly selected location
    location.isSelected(true);
    selectedLocation = location;

    //perform bounce animation once selected
    location.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      location.marker.setAnimation(null);
    }, 720);

    //build and display infoWindow
    this.showInfoWindow(location);
  }

  showInfoWindow(location) {
    this.infoWindow.setContent(location.name());
    this.infoWindow.open(map, location.marker);
  }

  applyFilter(filterText) {
    //initialize filteredLocations (clear markers and wipe array)
    this.filteredLocations().forEach(location => {
      location.marker.setMap(null);
      location.isSelected(false);
    });
    this.filteredLocations.removeAll();

    //for each location...
    //if no filter is specfiied, add location to unfiltered list.
    //if filter is specfieid, only add location if it matches the filter text.
    locations.forEach(location => {
      if (filterText != undefined) {
        if (location.name().toLowerCase().indexOf(filterText.location.value.toLowerCase()) > -1) {
          this.filteredLocations.push(location);
        }
      } else {
        this.filteredLocations.push(location);
      }
    })

    this.createMarkers();
  }

  //creates a marker for each location, including initial animation and
  //event listener for when the marker is clicked.
  createMarkers() {
    let self = this;

    this.filteredLocations().forEach(location => {
      location.marker = new google.maps.Marker(location.marker);
      location.marker.setAnimation(google.maps.Animation.DROP);
      location.marker.setMap(map);
      location.marker.addListener('click', function() {
        self.setSelectedItem(location);
      });
    });
  }
}

window.onload = function() {
  ko.applyBindings(new LocationsViewModel());
};
