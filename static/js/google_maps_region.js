$(document).ready(function()
{
    //var query = "SELECT DISTINCT ?area ?lat ?long WHERE { ?area rdf:type :Area ; :lat ?lat ; :long ?long . }";
    var query = "SELECT DISTINCT ?area ?lat ?long WHERE { ?area rdf:type :Area ; :lat ?lat ; :long ?long . }";
    $.get( "/sparql", data={'query': query}, function( data ) {
        console.log(data);
        
        result = data.results.bindings;
        
        initialize(result);
    });
});

function initialize(result) {
    var map;
    var centerPosition = new google.maps.LatLng(50.272213, -5.054973);
    var options = {
        'zoom': 12,
        'center': centerPosition,
        'mapTypeId': google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map'), options);    

    var l = result.length;
    
    for (var i = 0; i < l; i++)
    {
        centerPosition = new google.maps.LatLng(result[i]["lat"]["value"], result[i]["long"]["value"]);

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


