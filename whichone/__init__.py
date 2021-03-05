import os, argparse
from flask import Flask, session
from flask_session import Session
import whichone.spotipy

application = Flask(__name__)
application.debug = True

spotify_client_id = os.getenv('SPOTIFY_CLIENT_ID')
spotify_client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
spotify_redirect_uri = os.getenv('SPOTIFY_REDIRECT_URI')

application.config['SPOTIFY_CLIENT_ID'] = spotify_client_id
application.config['SPOTIFY_CLIENT_SECRET'] = spotify_client_secret
application.config['SPOTIFY_REDIRECT_URI'] = spotify_redirect_uri

application.config['SECRET_KEY'] = os.urandom(64)
application.config['SESSION_TYPE'] = 'filesystem'
application.config['SESSION_FILE_DIR'] = './.flask_session/'
Session(application)

from whichone import routes