import os
from flask import Flask
import whichone.spotipy

app = Flask(__name__)
app.debug = True

# Load config file
app.config.from_pyfile("config/defaults.py")
# Setup server using config variables
app.secret_key = app.config['SECRET_KEY']

auth = spotipy.oauth2.SpotifyOAuth(app.config['SPOTIFY_CLIENT_ID'],
                    app.config['SPOTIFY_CLIENT_SECRET'], "http://localhost:8080/", cache_path=".spotifycache", scope="user-library-read user-top-read")

#from whichone import routes