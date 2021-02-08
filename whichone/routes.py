from flask import render_template
from whichone import app

@app.route('/')
def index():
	return render_template('index.html')