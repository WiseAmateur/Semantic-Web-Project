# Semantic Web final project
# Name: Daan Siepelinga & Julien Benistant
# Student id: 2584178 & 2543043
# Date: TODO add date at end of project
#
# In this file the web application gets started using Flask on port 4000.

from flask import Flask, render_template, url_for, request, jsonify
from SPARQLWrapper import SPARQLWrapper, RDF, JSON
import requests, os, json, csv, re, ast


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")
    
@app.route("/ontology/<thing>")
def ontology(thing):
    query = "SELECT DISTINCT ?pred ?obj WHERE { :" + thing + " ?pred ?obj . }"
    result = sparql(query)
    
    # result is string
    result = json.dumps(result)
    
    # convert to python dictionary
    result = ast.literal_eval(result)

    # check if the thing exists in the application's ontology, if not show the 404 page
    if (len(result['results']['bindings']) == 0):
        return render_template('404.html')
    else:
        return render_template('ontology.html', thing=thing, result=result)
    
@app.route("/json_convert")
def json_convert():
    return render_template("json_convert.html")

@app.route("/json_test", methods=["GET"])
def json_test():
    return jsonify(json.load(open('ontology/disasters.json')))

@app.route("/csv_convert")
def csv_convert():
    return render_template("csv_convert.html")

@app.route("/csv_test", methods=["GET"])
def csv_test():
    json_file = open('ontology/countries.json', 'w')

    with open('ontology/worldbank_countries.csv') as csv_file:
        pattern = re.compile(':(.*)')
    
        reader = csv.DictReader(csv_file, delimiter=',')
        first = True;
        for row in reader:
            print row
            if (first):
                json_file.write("{\n\t\"result\": [\n\t\t{\n\t\t\t\"country\": \"" + 
                row["ECONOMY"] + "\",\n\t\t\t\"income\": \"" + re.sub(pattern, "", row["INCOME GROUP"]) + "\"\n\t\t}")
                first = False
            else:
                print row
                json_file.write(",\n\t\t{\n\t\t\t\"country\": \"" + row["ECONOMY"] +
                "\",\n\t\t\t\"income\": \"" + re.sub(pattern, "", row["INCOME GROUP"]) + "\"\n\t\t}")

        json_file.write("\n\t]\n}")
    
    json_file.close()
            
    data = json.load(open('ontology/countries.json'))
    
    return jsonify(data)
    
@app.route("/geo")
def geo():
    return render_template("geo.html")
    
@app.route("/geo_test", methods=["GET"])
def geo_test():
    query = request.args.get("query", None)    
    endpoint = request.args.get("endpoint")
    
    if (query and endpoint):
        return sendSparqlQuery(query, endpoint)
    else :
        return jsonify({"result": "Error"})
        
@app.route("/sparql", methods=["GET"])
def sparql(query=False):
    if (query == False):
        query = request.args.get("query", None)
        response = False
    else:
        response = True
    endpoint = "http://localhost:5820/naturalDisasterOntology/query"
    
    if (query):
        return sendSparqlQuery(query, endpoint, response)
    else :
        return jsonify({"result": "Error"})


# Freebase disaster query
#
#[{
#  "type": "/event/disaster",
#  "name": null,
#  "type_of_disaster": [],
#  "areas_affected": [],
#  "fatalities": null,
#  "injuries": null,
#  "damage": null,
#  "/time/event/start_date>=": "2000",
#  "/time/event/start_date": null,
#  "/time/event/end_date": null
#}]
def sendSparqlQuery(query, endpoint, response=False):
    sparql = SPARQLWrapper(endpoint)
        
    sparql.setQuery(query)

    sparql.setReturnFormat(JSON)
    sparql.addParameter("Accept","application/sparql-results+json")

    #sparql.addParameter("reasoning",True)
    
    try:
        response = sparql.query().convert()

        if (response):
            return response
        else:
            return jsonify(response)
    except Exception as e:
        return jsonify({"result": "Error"})
    

if __name__ == "__main__":
    app.debug = True
    port = int(os.environ.get("PORT", 4000))
    app.run(port=port)
