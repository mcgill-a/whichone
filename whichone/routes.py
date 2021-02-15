import os
import uuid
from flask import render_template, redirect, request, url_for, json, jsonify
from flask_session import Session
from whichone import app, session
import whichone.spotipy as spotipy

caches_folder = './.spotify_caches/'
if not os.path.exists(caches_folder):
    os.makedirs(caches_folder)


def session_cache_path():
    if not session.get('uuid'):
        session['uuid'] = str(uuid.uuid4())
    return caches_folder + session.get('uuid') 


@app.route('/')
def index():
    if not session.get('uuid'):
        # Step 1. Visitor is unknown, give random ID
        session['uuid'] = str(uuid.uuid4())

    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(
        client_id=app.config['SPOTIFY_CLIENT_ID'],
        client_secret=app.config['SPOTIFY_CLIENT_SECRET'],
        redirect_uri=app.config['SPOTIFY_REDIRECT_URI'],
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


@app.route('/logout')
def sign_out():
    try:
        # Remove the CACHE file (.cache-test) so that a new user can authorize.
        os.remove(session_cache_path())
        session.clear()
    except OSError as e:
        print ("Error: %s - %s." % (e.filename, e.strerror))
    return redirect('/')


@app.route('/playlists')
def playlists():
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(
        client_id=app.config['SPOTIFY_CLIENT_ID'],
        client_secret=app.config['SPOTIFY_CLIENT_SECRET'],
        redirect_uri=app.config['SPOTIFY_REDIRECT_URI'],
        cache_handler=cache_handler)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/')

    spotify = spotipy.Spotify(auth_manager=auth_manager)
    return spotify.current_user_playlists()


@app.route('/top_tracks')
def top_tracks():
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(
        client_id=app.config['SPOTIFY_CLIENT_ID'],
        client_secret=app.config['SPOTIFY_CLIENT_SECRET'],
        redirect_uri=app.config['SPOTIFY_REDIRECT_URI'],
        cache_handler=cache_handler)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/')
    spotify = spotipy.Spotify(auth_manager=auth_manager)
    tracks = spotify.current_user_top_tracks(time_range="long_term", limit=50)
    if not tracks is None:
        return tracks
    return "Could not find top tracks"


@app.route('/top_artists')
def top_artists():
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(
        client_id=app.config['SPOTIFY_CLIENT_ID'],
        client_secret=app.config['SPOTIFY_CLIENT_SECRET'],
        redirect_uri=app.config['SPOTIFY_REDIRECT_URI'],
        cache_handler=cache_handler)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/')
    spotify = spotipy.Spotify(auth_manager=auth_manager)
    artists = spotify.current_user_top_artists(time_range="long_term", limit=50)
    if not artists is None:
        return artists
    return "Could not find top artists"


@app.route('/audio_features', methods=['POST'])
def audio_features():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        if data != None and "track_ids" in data:
            cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
            auth_manager = spotipy.oauth2.SpotifyOAuth(
                client_id=app.config['SPOTIFY_CLIENT_ID'],
                client_secret=app.config['SPOTIFY_CLIENT_SECRET'],
                redirect_uri=app.config['SPOTIFY_REDIRECT_URI'],
                cache_handler=cache_handler)
            if not auth_manager.validate_token(cache_handler.get_cached_token()):
                print("no auth")
                return redirect('/')
            spotify = spotipy.Spotify(auth_manager=auth_manager)
            features = spotify.audio_features(tracks=data["track_ids"])
            if not features is None:
                return json.dumps(features), 200
            return "Could not find any audio features"
    return "Bad Request", 400


@app.route('/current_user')
def current_user():
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(
        client_id=app.config['SPOTIFY_CLIENT_ID'],
        client_secret=app.config['SPOTIFY_CLIENT_SECRET'],
        redirect_uri=app.config['SPOTIFY_REDIRECT_URI'],
        cache_handler=cache_handler)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/')
    spotify = spotipy.Spotify(auth_manager=auth_manager)
    return spotify.current_user()


@app.route('/play')
def play():
    user = current_user()
    if (type(user) is dict):
        # remove extra info from user object
        user_output = dict()
        user_output['display_name'] = user['display_name']
        if (user['images'][0] and user['images'][0]['url']):
            user_output['profile_pic'] = user['images'][0]['url']
        else:
            user_output['profile_pic'] = None 
        return render_template('play.html', user=user_output)  
        
    return redirect('/')