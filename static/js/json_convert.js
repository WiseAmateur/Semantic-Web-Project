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
    var area_instance, areas, areas_l, areas_append, count = 0;
    
    $("#result").html("<ul></ul>");

    for (var i = 0; i < result_l; i++)
    {
        areas = result[i].areas_affected;
        areas_l = areas.length;
        /* Only add instances with affected areas, as this is a crucial property to our application */
        if (areas_l)
        {
            areas_append = "";
        
            $("#result ul").append("<li>:" + convertSpecialChars(result[i].name) + " rdf:type owl:NamedIndividual ;</li>");
            
            for (var j = 0; j < areas_l; j++)
            {
                area_instance = ":" + convertSpecialChars(areas[j]);
                
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

/* Removing the characters from the imported data, while ensuring it remains dbpedia compatible */
function convertSpecialChars(string)
{
    /* Replace spaces with '_', apostrophe and brackets+content with nothing and remove slashes/comma's/– with everything after them */
    return string.replace(/ /g, "_").replace(/\u0027/g, '').replace(/\((.*)\)/g, '').replace(/[\/,–](.*)/, '');
}
