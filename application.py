# Semantic Web final project
# Name: Daan Siepelinga & Julien Benistant
# Student id: 2584178 & 2543043
# Date: TODO add date at end of project
#
# In this file the web application gets started using Flask on port 4000.

from flask import Flask, render_template, url_for, request, jsonify
from SPARQLWrapper import SPARQLWrapper, RDF, JSON
import requests, os, json, csv, re


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")
    
@app.route("/json_convert")
def json_convert():
    return render_template("json_convert.html")

@app.route("/json_test", methods=["GET"])
def json_test():
    data = []
    
#    with open('ontology/disasters.json') as f:
#        for line in f:
#            data.append(json.loads(line))

    data = json.load(open('ontology/disasters.json'))
            
    return jsonify(data)

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


if __name__ == "__main__":
    app.debug = True
    port = int(os.environ.get("PORT", 4000))
    app.run(port=port)
