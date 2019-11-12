from flask import Flask, render_template, url_for

# # pip install Flask-FontAwesome
from flask_fontawesome import FontAwesome

app = Flask(__name__)
fa = FontAwesome(app)

@app.route('/')
def home():
    return render_template('index.html')