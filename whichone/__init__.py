import os
from flask import Flask, session
from flask_session import Session
import whichone.spotipy

app = Flask(__name__)
app.debug = True

app.config.from_pyfile("config/defaults.py")
app.config['SECRET_KEY'] = os.urandom(64)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_FILE_DIR'] = './.flask_session/'
Session(app)

from whichone import routes