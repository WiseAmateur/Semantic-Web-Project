/* Semantic Web Project
 * Name: Daan Siepelinga & Julien Benistant
 * Student id: 2584178 & 2543043
 * Date: TODO add date at end of project
 * 
 */

$(document).ready(function()
{
    $("#json_test_button").click(function()
    {
        $.get( "/json_test", function( data ) {
            console.log(data);

            getAreas(data);
        });
    });
});

function getAreas(data)
{
    var result = data.result;
    var result_l = result.length;
    var area_instance, areas, areas_l, areas_append, types, types_l, count = 0;
    
    $("#result").html("<ul></ul>");

    for (var i = 0; i < result_l; i++)
    {
        areas = result[i].areas_affected;
        areas_l = areas.length;
        /* Only add instances with affected areas, as this is a crucial property to our application */
        if (areas_l)
        {
            areas_append = "";
        
            $("#result ul").append("<li>:" + convertSpecialCharsDisaster(result[i]["name"]) + " rdf:type owl:NamedIndividual ;</li>");
            
            if (result[i]["/time/event/start_date"])
                $("#result ul").append("<li>:start_date \"" + result[i]["/time/event/start_date"] + "\"^^xsd:string ;</li>");
                
            if (result[i]["/time/event/end_date"])
                $("#result ul").append("<li>:end_date \"" + result[i]["/time/event/end_date"] + "\"^^xsd:string ;</li>");
                
            if (result[i]["damage"])
                $("#result ul").append("<li>:damage \"" + result[i]["damage"] + "\"^^xsd:integer ;</li>");
                
            if (result[i]["fatalities"])
                $("#result ul").append("<li>:fatalities \"" + result[i]["fatalities"] + "\"^^xsd:integer ;</li>");
                
            if (result[i]["injuries"])
                $("#result ul").append("<li>:injuries \"" + result[i]["injuries"] + "\"^^xsd:integer ;</li>");

            types = result[i]["type_of_disaster"];
            types_l = types.length;
            for (var k = 0; k < types_l; k++)
            {
                console.log(types[k]);
                $("#result ul").append("<li>:disaster_type \"" + types[k] + "\"^^xsd:string ;"); 
            }
            
            for (var j = 0; j < areas_l; j++)
            {
                area_instance = ":" + convertSpecialCharsAreas(areas[j]);
                
                if (j == areas_l - 1)
                    $("#result ul").append("<li>:hit " + area_instance + " .</li>");
                else
                    $("#result ul").append("<li>:hit " + area_instance + " ;</li>");
                    
                areas_append += "<li>"/* + i + " "*/+ area_instance + " rdf:type :Area , owl:NamedIndividual .</li>";
            }
            
            $("#result ul").append(areas_append);
        //    count += 1;
        }
    }
    //$("#result").append(count);
}

/* Removing the characters from the imported area data, while ensuring it remains dbpedia compatible */
function convertSpecialCharsAreas(string)
{
    /* Replace spaces with '_', apostrophe and brackets+content with nothing and remove slashes/comma's/– with everything after them */
    return string.replace(/ /g, "_").replace(/\u0027/g, '').replace(/\((.*)\)/g, '').replace(/[\/,–](.*)/, '');
}

/* Removing the characters from the imported disaster data, while ensuring it remains dbpedia compatible */
function convertSpecialCharsDisaster(string)
{
    /* Replace spaces with '_', apostrophe/comma/brackets+content with nothing and remove slashes/– with everything after them */
    return string.replace(/ /g, "_").replace(/–/g, "-").replace(/[,\u0027]/g, '').replace(/\((.*)\)/g, '').replace(/\/(.*)/, '');
}
