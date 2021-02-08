from flask import render_template, redirect, request
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

@app.route('/2songs')
def random():
	return 'kasbdhkiasd'