$(window).load(function()
{
    /* Query to get all area's that are of a risk type with their latitude and longitude */
    var query = "SELECT DISTINCT ?area ?risk ?lat ?long WHERE { VALUES ?risk " + 
                "{:Very_High_Risk_Area :High_Risk_Area :Medium_Risk_Area :Low_Risk_Area}" +
                " ?area rdf:type :Area ; rdf:type ?risk ; :lat ?lat ; :long ?long . }";
              
    /* Ajax call to get the results of the sparql query and draw them on the map afterwards */
    $.get("/sparql", data={'query': query}, function(data)
    {
        result = data.results.bindings;
        
        initMapCircles(result);
    });
});

/* Return the color based on the area risk type */
function returnColor(areaType)
{
    switch(areaType) {
        /* Dark red */
        case "Very_High_Risk_Area":
            return "#190707";
        /* Red */
        case "High_Risk_Area":
            return "#FF0000";
        /* Orange */
        case "Medium_Risk_Area":
            return "#FF8000";
        /* Yellow */
        case "Low_Risk_Area":
            return "#FFFF00";
        /* Blue */
        default:
            return "#0040FF";
    }
}

/* Map and searchbox initialization function, gets called from the javascript include in the html */
function initMapWithSearchBox()
{
    /* Setting up the basic Google map with its appearance, zooming and center position */
    var options = {
        zoom: 6,
        center: new google.maps.LatLng(43.78333333333333, 11.25),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    window['map'] = new google.maps.Map(document.getElementById('map'), options);

    /* Create the search box and link it to the UI element. */
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    window['map'].controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    /* Bias the SearchBox results towards current map's viewport. */
    window['map'].addListener('bounds_changed', function()
    {
        searchBox.setBounds(window['map'].getBounds());
    });


    var markers = [];
    /* Listen for the event fired when the user selects a prediction and retrieve
     * more details for that place. */
    searchBox.addListener('places_changed', function()
    {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        /* For each place, get the icon, name and location. */
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place)
        {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            if (place.geometry.viewport) {
                /* Only geocodes have viewport. */
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        window['map'].fitBounds(bounds);
    });
}

/* Draw the circles on the map on the risk area's */
function initMapCircles(result) {

    var l = result.length;
    var color;

    /* Loop through the results, creating a circle per risk area */
    for (var i = 0; i < l; i++)
    {
        color = returnColor(result[i]["risk"]["value"].split("#")[1]);
        centerPosition = new google.maps.LatLng(result[i]["lat"]["value"], result[i]["long"]["value"]);
        
        /* Create the circle with its position and color */
        var circle = new google.maps.Circle({
            center: centerPosition,
            map: window['map'],
            fillColor: color,
            fillOpacity: 1.0,
            strokeColor: "#000000",
            strokeOpacity: 1.0,
            strokeWeight: 1,
            draggable: false,
            radius: 18362.55489862987,
            id: "circle" + i
        });
        
        /* Add a hidden link that will be activated when clicking on the corresponding circle*/
        $("#map").after("<a id='circle" + i + "' class='none' href='/ontology/" + result[i]["area"]["value"].split("#")[1] + "'><span></span></a>");
        
        /* Add a click event to the circle redirecting it to its area instance page */
        google.maps.event.addListener(circle, 'click', function(ev){
            console.log("#" + this.id);
            $("#" + this.id + " span").trigger("click");
        });
    }
}
