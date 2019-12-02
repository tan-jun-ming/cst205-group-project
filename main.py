from quart import Quart, render_template, request
import json, requests

app = Quart(__name__)

@app.route("/")
def hello():
    return render_template("index.html")

@app.route('/postmethod', methods = ['POST'])
def get_post_javascript_data():
    jsdata = request.form['javascript_data']
    print(json.loads(jsdata)[0])
    return

app.run()