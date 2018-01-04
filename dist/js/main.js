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
  , new Location("Don Hutson Center", 44.4982522,-88.05724300000003, "ChIJXQC2C1P6AogRJJeEszaKQd0")
  , new Location("Green Bay Packers Hall of Fame", 44.50175470000001,-88.0604447, "ChIJgYhGFjf7AogRDJ9W5lJonZU")
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
    //initialize info window content
    this.infoWindow.setContent(null);

    //retrieve details on the location from web services
    //add content to info window as responses are received
    this.getPlacesDetails(location);
    this.getWikiDetails(location);

    this.infoWindow.open(map, location.marker);
  }

  //make web api call to retrieve info from Google Places API.
  getPlacesDetails(location) {
    let placesService = new google.maps.places.PlacesService(map);
    let self = this;

    placesService.getDetails({
      placeId: location.placeId
    }, function (place, status) {  //add response data to infoWindow
          let placesHTML = '<div><h4>' + location.name() + '</h4><br><u>Details from Google Places:</u><br><br>';

          if (status === google.maps.places.PlacesServiceStatus.OK) {
            if (place.formatted_address) {
              placesHTML += '<strong>Address:</strong>';
              placesHTML += '<br>' + place.formatted_address;
            }
            if (place.formatted_phone_number) {
              placesHTML += '<br>' + place.formatted_phone_number;
            }
            if (place.opening_hours) {
              placesHTML += '<br><br><strong>Hours:</strong><br>' +
                  place.opening_hours.weekday_text[0] + '<br>' +
                  place.opening_hours.weekday_text[1] + '<br>' +
                  place.opening_hours.weekday_text[2] + '<br>' +
                  place.opening_hours.weekday_text[3] + '<br>' +
                  place.opening_hours.weekday_text[4] + '<br>' +
                  place.opening_hours.weekday_text[5] + '<br>' +
                  place.opening_hours.weekday_text[6];
            }
            if (place.photos) {
              placesHTML += '<br><br><img src="' + place.photos[0].getUrl({maxHeight: 100, maxWidth: 200}) + '">';
            }
          } else {  //if failed, share status code with the user indicating the issue.
            placesHTML += '<strong>Unable to retrieve Google Places info.</strong><br>Status Code: ' + status;
          }

          placesHTML += '</div>';

          //assemble content of infoWindow so that Google Places info is always first, followed by Wikipedia info.
          if (self.infoWindow.content === null) {
            self.infoWindow.setContent(placesHTML);
          } else {
            self.infoWindow.setContent(placesHTML + self.infoWindow.content);
          }
    });
  }

  getWikiDetails(location) {
    let placeName = location.name();
    let wikiHTML = '<div><hr>';
    let self = this;

    //make web api call to retrieve details from Wikipedia API
    fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${placeName}&format=json&origin=*`)
    .then(response => response.json())  //convert response to json
    .then(function(data) {  //add response data to infoWindow
      wikiHTML += '<u>Details from wikipedia.com:</u><br><br>';

      if (data[2][0] === undefined || data[2][0] === '') {
        wikiHTML += 'No description found.';
      } else {
        wikiHTML += data[2][0];
      }

      if (data[3][0] === undefined || data[3][0] === '') {
        wikiHTML += '<br>No link found.';
      } else {
        wikiHTML += '<br><a href="'+ data[3][0] + '">Click to learn more.</a>';
      }

      wikiHTML += '</div>';

      //assemble content of infoWindow so that Google Places info is always first, followed by Wikipedia info.
      if (self.infoWindow.content === null) {
        self.infoWindow.setContent(wikiHTML);
      } else {
        self.infoWindow.setContent(self.infoWindow.content + wikiHTML);
      }
    })
    .catch(function(err) {  //add error data, if any, to infoWindow
      wikiHTML += '<strong>Error retrieving Wikipedia info.</strong><br>Return Message: ' + err;
      wikiHTML += '</div>';

      //assemble content of infoWindow so that Google Places info is always first, followed by Wikipedia info.
      if (self.infoWindow.content === null) {
        self.infoWindow.setContent(wikiHTML);
      } else {
        self.infoWindow.setContent(self.infoWindow.content + wikiHTML);
      }
    });
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
      if (filterText !== undefined) {
        if (location.name().toLowerCase().indexOf(filterText.location.value.toLowerCase()) > -1) {
          this.filteredLocations.push(location);
        }
      } else {
        this.filteredLocations.push(location);
      }
    });

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
