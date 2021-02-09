import os
from flask import render_template, redirect, request, url_for, json, jsonify
from spotipy.oauth2 import SpotifyOAuth
from whichone import app

@app.route("/")
def index():

    token_info = auth.get_cached_token()
    if not token_info:
        # If there isn't a cached token then you will be redirected to a page where you will be asked to login to spotify
        # After that procceed to /callback
        auth_url = auth.get_authorize_url()
        return redirect(auth_url)

    token = token_info['access_token']

    # At this point you can now create a Spotifiy instance with
    spotipy.client.Spotify(auth=token)

    return f"You now have an access token : {token}"


@app.route("/callback/")
def callback():
    url = request.url
    code = auth.parse_response_code(url)
    token = auth.get_access_token(code)
    # Once the get_access_token function is called, a cache will be created making it possible to go through the route "/" without having to login anymore
    return redirect("/")


@app.route('/2songs')
def random():

	filename = os.path.join(app.static_folder, 'resources', 'top10.json')

	with open(filename) as test_file:
		data = json.load(test_file)

	return jsonify(data)