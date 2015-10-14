/* Semantic Web Project
 * Name: Daan Siepelinga & Julien Benistant
 * Student id: 2584178 & 2543043
 * Date: TODO add date at end of project
 * 
 */

$(document).ready(function()
{
    $("#csv_test_button").click(function()
    {
        $.get( "/csv_test", function( data ) {
            console.log(data);

            getCountries(data);
        });
    });
});

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
    //$("#result").append(count);
}

/* Removing the characters from the imported country data, while ensuring it remains dbpedia compatible */
function convertSpecialChars(string)
{
    /* Replace spaces with '_' */
    return string.replace(/ /g, "_");
}
