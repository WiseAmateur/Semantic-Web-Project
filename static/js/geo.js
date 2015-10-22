/* Semantic Web Project
 * Name: Daan Siepelinga & Julien Benistant
 * Student id: 2584178 & 2543043
 * Date: TODO add date at end of project
 * 
 */

$(document).ready(function()
{
    $("#geo_test_button").click(function()
    {
        var query = "SELECT DISTINCT ?area WHERE { ?area rdf:type :Area . }";
        var endpoint = "http://localhost:5820/naturalDisasterOntology/query";
        $.get( "/geo_test", data={'query': query, 'endpoint': endpoint}, function( data ) {
            console.log(data);
            var values = "{";
            
            var area_l = data.results.bindings.length;
            
            for (var i = 0; i < area_l; i++)
            {
                values += " dbr:" + data.results.bindings[i]["area"]["value"].split("#")[1];
            }
            values += " }";
            
            console.log(values);

            getGeoInfo(values);
        });
    });
});

function getGeoInfo(areas)
{
    var query = "SELECT DISTINCT ?area ?point ?areaTotal ?country WHERE { VALUES ?area " + areas + 
    " ?area georss:point ?point . OPTIONAL {?area dbo:areaTotal ?areaTotal } . OPTIONAL { ?area dbo:country ?country } . }";
    var endpoint = "http://dbpedia.org/sparql";
    $.get( "/geo_test", data={'query': query, 'endpoint': endpoint}, function( data ) {
        console.log(data);
        
        var result = data.results.bindings;
        var result_l = result.length;
        
        $("#result").html("<ul></ul>");

        for (var i = 0; i < result_l; i++)
        {
            $("#result ul").append("<li>" + result[i]["area"]["value"].replace("http://dbpedia.org/resource/",":") + 
                                    " :lat \"" + result[i]["point"]["value"].split(" ")[0] + "\"^^xsd:float ;</li>");
                                    
            if (result[i]["country"] && result[i]["areaTotal"])
            {
                $("#result ul").append("<li>:long \"" + result[i]["point"]["value"].split(" ")[1] + 
                                        "\"^^xsd:float ;</li><li>dbo:country :" + 
                                        result[i]["country"]["value"].split("/resource/")[1].replace("%7B%7B", "Philippines") +
                                        " ;</li><li>dbo:areaTotal \"" + result[i]["areaTotal"]["value"] + "\"^^xsd:double .</li>");
            }
            else if (result[i]["country"])
            {
                $("#result ul").append("<li>:long \"" + result[i]["point"]["value"].split(" ")[1] + 
                                        "\"^^xsd:float ;</li><li>dbo:country :" + 
                                        result[i]["country"]["value"].split("/resource/")[1].replace("%7B%7B", "Philippines") +
                                        " .</li>");
            }
            else if (result[i]["areaTotal"])
            {
                $("#result ul").append("<li>:long \"" + result[i]["point"]["value"].split(" ")[1] + 
                                        "\"^^xsd:float ;</li><li>dbo:areaTotal \"" + result[i]["areaTotal"]["value"] + "\"^^xsd:double .</li>");
            }
            else
            {
                $("#result ul").append("<li>:long \"" + result[i]["point"]["value"].split(" ")[1] + "\"^^xsd:float .</li>");
            }
        }
    });
}
