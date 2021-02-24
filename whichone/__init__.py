import os, argparse
from flask import Flask, session
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_session import Session
import whichone.spotipy

app = Flask(__name__)
app.debug = True

parser = argparse.ArgumentParser() 
parser.add_argument("-id", required=True, type=str, help = "Spotify Developer API Client ID")
parser.add_argument("-secret", required=True, type=str, help = "Spotify Developer API Client Secret")
parser.add_argument("-redirect", type=str, default="http://127.0.0.1:8080", help = "Spotify Login Redirect URI")
parser.add_argument("-limit_route", default=["50 per day", "30 per hour"], nargs='+', help = "Rate limit for accessing page routes")
parser.add_argument("-limit_api", default=["10 per day"], nargs='+', help = "Rate limit for accessing API routes")
args = parser.parse_args() 

app.config['SPOTIFY_CLIENT_ID'] = args.id
app.config['SPOTIFY_CLIENT_SECRET'] = args.secret
app.config['SPOTIFY_REDIRECT_URI'] = args.redirect
app.config['LIMIT_ROUTE'] = args.limit_route
app.config['LIMIT_API'] = args.limit_api


app.config['SECRET_KEY'] = os.urandom(64)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = './.flask_session/'
Session(app)

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=app.config['LIMIT_ROUTE']
)

from whichone import routes