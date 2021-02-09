import os
from flask import render_template, redirect, request, url_for, json, jsonify
from whichone.spotify import startup
from whichone import app

@app.route('/login')
def login():
	response = startup.getUser()
	return redirect(response)

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/callback/')
def cb():
	
	#startup.getUserToken(request.args['code'])
	return render_template('index.html')

@app.route('/artists')
def artists():

	filename = os.path.join(app.static_folder, 'resources', 'top50.json')

	with open(filename) as test_file:
		data = json.load(test_file)

	return jsonify(data)

@app.route('/tracks')
def tracks():

	filename = os.path.join(app.static_folder, 'resources', 'top50tracks.json')

	with open(filename) as test_file:
		data = json.load(test_file)

	return jsonify(data)