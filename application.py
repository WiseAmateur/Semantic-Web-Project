# Semantic Web final project
# Name: Daan Siepelinga & Julien Benistant
# Student id: 2584178 & 2543043
# Date: TODO add date at end of project
#
# In this file the web application gets started using Flask on port 4000.

from flask import Flask, render_template, url_for, request, jsonify
from SPARQLWrapper import SPARQLWrapper, RDF, JSON
import requests
import os
import json


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


if __name__ == "__main__":
    app.debug = True
    port = int(os.environ.get("PORT", 4000))
    app.run(port=port)
