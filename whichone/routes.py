import os
import uuid
from flask import render_template, redirect, request, url_for, json, jsonify
from whichone import app, session
import whichone.spotipy as spotipy

caches_folder = './.spotify_caches/'
if not os.path.exists(caches_folder):
    os.makedirs(caches_folder)


def session_cache_path():
    return caches_folder + session.get('uuid')


@app.route('/')
def index():
    if not session.get('uuid'):
        # Step 1. Visitor is unknown, give random ID
        session['uuid'] = str(uuid.uuid4())

    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(
        client_id=app.config['SPOTIPY_CLIENT_ID'],
        client_secret=app.config['SPOTIPY_CLIENT_SECRET'],
        redirect_uri=app.config['SPOTIPY_REDIRECT_URI'],
        scope='user-top-read user-read-currently-playing playlist-modify-private',
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
    return f'<h2>Hi {spotify.me()["display_name"]}, ' \
           f'<small><a href="/sign_out">[sign out]<a/></small></h2>' \
           f'<a href="/playlists">my playlists</a> | ' \
           f'<a href="/currently_playing">currently playing</a> | ' \
           f'<a href="/top_tracks">top tracks</a> | ' \
           f'<a href="/top_artists">top artists</a> | ' \
		   f'<a href="/current_user">me</a>' \


@app.route('/sign_out')
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
        client_id=app.config['SPOTIPY_CLIENT_ID'],
        client_secret=app.config['SPOTIPY_CLIENT_SECRET'],
        redirect_uri=app.config['SPOTIPY_REDIRECT_URI'],
        cache_handler=cache_handler)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/')

    spotify = spotipy.Spotify(auth_manager=auth_manager)
    return spotify.current_user_playlists()


@app.route('/currently_playing')
def currently_playing():
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(
        client_id=app.config['SPOTIPY_CLIENT_ID'],
        client_secret=app.config['SPOTIPY_CLIENT_SECRET'],
        redirect_uri=app.config['SPOTIPY_REDIRECT_URI'],
        cache_handler=cache_handler)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/')
    spotify = spotipy.Spotify(auth_manager=auth_manager)
    track = spotify.current_user_playing_track()
    if not track is None:
        return track
    return "No track currently playing."


@app.route('/top_tracks')
def top_tracks():
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(
        client_id=app.config['SPOTIPY_CLIENT_ID'],
        client_secret=app.config['SPOTIPY_CLIENT_SECRET'],
        redirect_uri=app.config['SPOTIPY_REDIRECT_URI'],
        cache_handler=cache_handler)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/')
    spotify = spotipy.Spotify(auth_manager=auth_manager)
    tracks = spotify.current_user_top_tracks(time_range="medium_term", limit=50)
    if not tracks is None:
        return tracks
    return "Could not find top tracks"


@app.route('/top_artists')
def top_artists():
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(
        client_id=app.config['SPOTIPY_CLIENT_ID'],
        client_secret=app.config['SPOTIPY_CLIENT_SECRET'],
        redirect_uri=app.config['SPOTIPY_REDIRECT_URI'],
        cache_handler=cache_handler)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/')
    spotify = spotipy.Spotify(auth_manager=auth_manager)
    artists = spotify.current_user_top_artists(time_range="medium_term", limit=50)
    if not artists is None:
        return artists
    return "Could not find top artists"


@app.route('/audio_features', methods=['POST'])
def audio_features():
    if request.method == 'POST':
        data = request.get_json()
        if data.track_ids:
            print(data.track_ids)
            return data.track_ids
    """        
            cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
            auth_manager = spotipy.oauth2.SpotifyOAuth(
                client_id=app.config['SPOTIPY_CLIENT_ID'],
                client_secret=app.config['SPOTIPY_CLIENT_SECRET'],
                redirect_uri=app.config['SPOTIPY_REDIRECT_URI'],
                cache_handler=cache_handler)
            if not auth_manager.validate_token(cache_handler.get_cached_token()):
                return redirect('/')
            spotify = spotipy.Spotify(auth_manager=auth_manager)
            features = spotify.audio_features(tracks=[track_ids])
            if not features is None:
                return features
            return "Could not find any audio features"
    """
    return []


@app.route('/current_user')
def current_user():
    cache_handler = spotipy.cache_handler.CacheFileHandler(cache_path=session_cache_path())
    auth_manager = spotipy.oauth2.SpotifyOAuth(
        client_id=app.config['SPOTIPY_CLIENT_ID'],
        client_secret=app.config['SPOTIPY_CLIENT_SECRET'],
        redirect_uri=app.config['SPOTIPY_REDIRECT_URI'],
        cache_handler=cache_handler)
    if not auth_manager.validate_token(cache_handler.get_cached_token()):
        return redirect('/')
    spotify = spotipy.Spotify(auth_manager=auth_manager)
    return spotify.current_user()

@app.route('/old')
def oldIndex():
    return render_template('index.html')