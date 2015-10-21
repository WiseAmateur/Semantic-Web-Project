$(document).ready(function()
{
    var query = "SELECT DISTINCT ?area ?lat ?long WHERE { ?area rdf:type :Area ; :lat ?lat ; :long ?long . }";
    //var query = "SELECT DISTINCT ?area ?type ?lat ?long WHERE { VALUES ?type {:High_Risk_Area :Medium_Risk_Area :Low_Risk_Area :No_Risk_Area} ; ?area rdf:type :Area ; rdf:type ?type ; :lat ?lat ; :long ?long . }";
    


    $.get( "/sparql", data={'query': query}, function( data ) {
        console.log(data);
        
        result = data.results.bindings;
        
        initAutocomplete(result);
    });
});

function initAutocomplete(result) {
    var map;
    var centerPosition = new google.maps.LatLng(50.272213, -5.054973);
    var options = {
        'zoom': 12,
        'center': centerPosition,
        'mapTypeId': google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map'), options);    

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

  var markers = [];
  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
    // [END region_getplaces]

    var l = result.length;
    
    for (var i = 0; i < l; i++)
    {
        centerPosition = new google.maps.LatLng(result[i]["lat"]["value"], result[i]["long"]["value"]);
/*
        if (result[i]["type"]["value"] == "No_Risk_Area")
            var circleColor = '#0000FF';                        // blue
        if (result[i]["type"]["value"] == "Low_Risk_Area")
            var circleColor = '#FFFF00';                        // yellow
        if (result[i]["type"]["value"] == "Medium_Risk_Area")
            var circleColor = '#FFA500';                        // orange
        if (result[i]["type"]["value"] == "High_Risk_Area")
            var circleColor = '#FF0000';                        // red
*/
        var circle = new google.maps.Circle({
            center: centerPosition,
            map: map,
            fillColor: '#0000FF',
            fillOpacity: 0.5,
            strokeColor: '#0000FF',
            strokeOpacity: 1.0,
            strokeWeight: 2,
            draggable: false,
            zIndex: 30
        });


        circle.setRadius(18362.55489862987);

        map.fitBounds(circle.getBounds());

        var labelText = result[i]["area"]["value"].split("#")[1];

        var myOptions = {
            content: labelText,
            boxStyle: {
                background: '#FFFFFF',
                border: "1px solid black",
                textAlign: "center",
                fontSize: "8pt",
                width: "90px",
                zIndex: 60
            },
            disableAutoPan: true,
            pixelOffset: new google.maps.Size(-45, 0),
            position: centerPosition,
            closeBoxURL: "",
            isHidden: false,
            pane: "mapPane",
            enableEventPropagation: true
        };

        var label = new InfoBox(myOptions);
        label.open(map);

        google.maps.event.addListener(circle, 'center_changed', function () {
            label.setPosition(circle.getCenter());
        });
    }
}


