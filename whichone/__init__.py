import os
from flask import Flask, session
from flask_session import Session
import whichone.spotipy

app = Flask(__name__)
app.debug = True

directory = os.path.dirname(__file__)
config_file = "config/defaults.py"
if os.path.isfile(directory + "/" + config_file):
    app.config.from_pyfile(config_file)
    
    if not('SPOTIFY_CLIENT_ID' in app.config):
        print("SPOTIFY_CLIENT_ID not found in /config/defaults.py")
        exit(0)
    elif not('SPOTIFY_CLIENT_SECRET' in app.config):
        print("SPOTIFY_CLIENT_SECRET not found in /config/defaults.py")
        exit(0)
    elif not('SPOTIFY_REDIRECT_URI' in app.config):
        print("SPOTIFY_REDIRECT_URI not found in /config/defaults.py")
        exit(0)
    else:
        app.config['SECRET_KEY'] = os.urandom(64)
        app.config['SESSION_TYPE'] = 'filesystem'
        app.config['SESSION_FILE_DIR'] = './.flask_session/'
        Session(app)

        from whichone import routes
else:
    print("Unable to find a configuration file.")
    print("Create a configuration file: /config/defaults.py")
    print("Example configuration file: /config/defaults_example.py")
    exit(0)