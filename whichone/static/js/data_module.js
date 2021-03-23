function Data(spotify_id, initialisePage, data) {
  data.updateHighScore = function updateHighScore(score) {
    data.user.highScore = score;
    updateLocalUser(spotify_id);
  };

  data.isDataReady = function isDataReady() {
    return (
      data.user !== null &&
      data.user.top_artists !== null &&
      data.user.top_tracks !== null &&
      data.audio_features !== null
    );
  };

  data.isAudioEnabled = function isAudioEnabled() {
    return data.user.audioEnabled;
  };

  data.toggleMute = function toggleMute() {
    data.user.audioEnabled = !data.user.audioEnabled;
    updateLocalUser(spotify_id);
  };

  data.toggleMode = function toggleMode(toggle, id = spotify_id) {
    data.user.modes[toggle.id] = toggle.checked;
    updateLocalUser(id);
  };

  data.init = function init(user, id = spotify_id) {
    data.user = user;
    console.log(data.user);
    updateLocalUser(id);
    // now that data has been loaded, setup the page settings
    initialisePage(data.user.audioEnabled, data.user.modes);
  }

  function updateLocalUser(id, userObject = data.user) {
    localStorage.setItem(id, JSON.stringify(userObject));
  }
}
