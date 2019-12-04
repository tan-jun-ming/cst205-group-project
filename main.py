from quart import Quart, render_template, request
import json, requests

app = Quart(__name__)

@app.route("/")
def hello():
    return render_template("index.html")

app.run()