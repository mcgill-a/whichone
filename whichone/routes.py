import os
import uuid
from flask import render_template, redirect, request, url_for, json, jsonify
from flask_session import Session
from werkzeug.exceptions import HTTPException
from whichone import application, session
import whichone.spotipy as spotipy

caches_folder = './.spotify_caches/'
if not os.path.exists(caches_folder):
    os.makedirs(caches_folder)

def session_cache_path():
    if not session.get('uuid'):
        session['uuid'] = str(uuid.uuid4())
    return caches_folder + session.get('uuid') 


@application.before_request
def before_request():
    if request.url.startswith('http://'):
        url = request.url.replace('http://', 'https://', 1)
        code = 301
        return redirect(url, code=code)


@application.route('/')
def index():
    if not session.get('uuid'):
        # Step 1. Visitor is unknown, give random ID
        session['uuid'] = str(uuid.uuid4())

    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(
        client_id=application.config['SPOTIFY_CLIENT_ID'],
        client_secret=application.config['SPOTIFY_CLIENT_SECRET'],
        redirect_uri=application.config['SPOTIFY_REDIRECT_URI'],
        scope='user-top-read',
        cache_handler=cache_handler,
        show_dialog=True)

    if request.args.get("code"):
        # Step 3. Being redirected from Spotify auth page
        auth_manager.get_access_token(request.args.get("code"))
        return redirect('/')

    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        # Step 2. Display sign in link when no token
        auth_url = auth_manager.get_authorize_url()
        #return f'<h2><a href="{auth_url}">Sign in</a></h2>'
        return render_template('landing.html', auth_url=auth_url)

    # Step 4. Signed in, display data
    spotify = spotipy.Spotify(auth_manager=auth_manager)
    return redirect('/play')


@application.route('/play')
def play():
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(
        client_id=application.config['SPOTIFY_CLIENT_ID'],
        client_secret=application.config['SPOTIFY_CLIENT_SECRET'],
        redirect_uri=application.config['SPOTIFY_REDIRECT_URI'],
        cache_handler=cache_handler)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/')
    return render_template('play.html')

@application.route('/feedback')
def form():
    return render_template('feedback.html')

@application.route('/logout')
def sign_out():
    try:
        # Remove the CACHE file (.cache-test) so that a new user can authorize.
        os.remove(session_cache_path())
        session.clear()
    except OSError as e:
        pass
    return redirect('/')


@application.route('/top_tracks')
def top_tracks():
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(
        client_id=application.config['SPOTIFY_CLIENT_ID'],
        client_secret=application.config['SPOTIFY_CLIENT_SECRET'],
        redirect_uri=application.config['SPOTIFY_REDIRECT_URI'],
        cache_handler=cache_handler)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/')
    spotify = spotipy.Spotify(auth_manager=auth_manager)
    tracks = spotify.current_user_top_tracks(time_range="long_term", limit=50)
    tracks2 = spotify.current_user_top_tracks(time_range="long_term", limit=50, offset=49)
    if tracks is not None and tracks2 is not None:
        tracks['items'].extend(tracks2['items'][1:])
        return json.dumps(tracks['items'])
    return json.dumps([]), 204

@application.route('/top_artists')
def top_artists():
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(
        client_id=application.config['SPOTIFY_CLIENT_ID'],
        client_secret=application.config['SPOTIFY_CLIENT_SECRET'],
        redirect_uri=application.config['SPOTIFY_REDIRECT_URI'],
        cache_handler=cache_handler)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/')
    spotify = spotipy.Spotify(auth_manager=auth_manager)
    artists = spotify.current_user_top_artists(time_range="long_term", limit=50)
    artists2 = spotify.current_user_top_artists(time_range="long_term", limit=50, offset=49)
    if artists is not None and artists2 is not None:
        artists['items'].extend(artists2['items'][1:])
        return json.dumps(artists['items'])
    return json.dumps([]), 204


@application.route('/audio_features', methods=['POST'])
def audio_features():
    if request.method == 'POST':
        data = request.get_json()
        if data != None and "track_ids" in data:
            cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
            auth_manager = spotipy.oauth2.SpotifyOAuth(
                client_id=application.config['SPOTIFY_CLIENT_ID'],
                client_secret=application.config['SPOTIFY_CLIENT_SECRET'],
                redirect_uri=application.config['SPOTIFY_REDIRECT_URI'],
                cache_handler=cache_handler)
            if not auth_manager.validate_token(cache_handler.get_cached_token()):
                return redirect('/')
            spotify = spotipy.Spotify(auth_manager=auth_manager)
            features = spotify.audio_features(tracks=data["track_ids"])
            if not features is None:
                return json.dumps(features), 200
            return "Could not find any audio features"
    return "Bad Request", 400


@application.errorhandler(Exception)
def handle_error(e):
    code = 500
    if isinstance(e, HTTPException):
        code = e.code
    return render_template('error.html', error=str(e), code=code), code