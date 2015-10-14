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

            //getCountries(data);
        });
    });
});

function getGeoInfo(areas)
{
    var query = "SELECT DISTINCT ?area ?point ?country WHERE { VALUES ?area " + areas + 
    " ?area georss:point ?point . OPTIONAL { ?area dbo:country ?country} }";
    var endpoint = "http://dbpedia.org/sparql";
    $.get( "/geo_test", data={'query': query, 'endpoint': endpoint}, function( data ) {
        console.log(data);
        
        var result = data.results.bindings;
        var result_l = result.length;
        
        $("#result").html("<ul></ul>");

        for (var i = 0; i < result_l; i++)
        {
            $("#result ul").append("<li>:" + result[i]["area"]["value"] + " rdf:type :Area , owl:namedIndividual ;</li><li>owl:sameAs :" +
                                    result[i]["area"]["value"].split("/resource/")[1] + " ;</li><li>:lat " + 
                                    result[i]["point"]["value"].split(" ")[0] + " ;</li>");
                                    
            if (result[i]["country"])
                $("#result ul").append("<li>:long " + result[i]["point"]["value"].split(" ")[1] + 
                                        " ;</li><li>dbo:country :" + result[i]["country"]["value"].split("/resource/")[1] + " .</li>");
            else
                $("#result ul").append("<li>:long " + result[i]["point"]["value"].split(" ")[1] + " .</li>");
        }
    });
}

function getCountries(data)
{
    var result = data.result;
    var result_l = result.length;
    
    $("#result").html("<ul></ul>");

    for (var i = 0; i < result_l; i++)
    {
        if (result[i]["income"] == "Low income")
            $("#result ul").append("<li>:" + convertSpecialChars(result[i]["country"]) + " rdf:type :Low_Income_Country , owl:NamedIndividual .</li>");

        if (result[i]["income"] == "Lower middle income" || result[i]["income"] == "Upper middle income")
            $("#result ul").append("<li>:" + convertSpecialChars(result[i]["country"]) + " rdf:type :Middle_Income_Country , owl:NamedIndividual .</li>");

        if (result[i]["income"] == "High income")
            $("#result ul").append("<li>:" + convertSpecialChars(result[i]["country"]) + " rdf:type :High_Income_Country , owl:NamedIndividual .</li>");
    }
}
