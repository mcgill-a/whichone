function Data(spotify_id, initialisePage, data) {
  const EXPIRATION_TIME = 604800000; // 1 week (milliseconds)

  data.updateHighScore = function updateHighScore(score) {
    data.user.highScore = score;
    updateLocalUser(spotify_id);
  };

  data.isDataReady = function isDataReady() {
    return (
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

  data.init = function init(currentTime = Date.now(), id = spotify_id) {
    if (isLocalDataAvailable(id)) {
      data.user = getLocalData(id);
      updateLocalUser(id);
    } else {
      data.user = getDefaultData();
    }
    // now that data has been loaded, setup the page settings
    initialisePage(data.user.audioEnabled, data.user.modes);

    // if 1 week has passed or default data (0),
    // it is expired, get spotify data
    if (isLocalDataExpired(data.user.expire, currentTime, EXPIRATION_TIME)) {
      getSpotifyData()
        .then((data) => {
          data.user.top_artists = data.top_artists;
          data.user.top_tracks = data.top_tracks;
          data.user.audio_features = data.audio_features;
          data.user.expire = currentTime;
          updateLocalUser(id);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  function isLocalDataAvailable(id) {
    return localStorage.getItem(id) !== null;
  }

  function isLocalDataExpired(
    storedTimestamp,
    currentTimestamp,
    expirationTime
  ) {
    return currentTimestamp - storedTimestamp > expirationTime;
  }

  function updateLocalUser(id, userObject = data.user) {
    localStorage.setItem(id, JSON.stringify(userObject));
  }

  function getDefaultData() {
    return {
      top_artists: null,
      top_tracks: null,
      audio_features: null,
      expire: 0,
      highScore: 0,
      scores: [],
      audioEnabled: true,
      modes: {
        danceability: true,
        valence: true,
        duration_ms: true,
      },
    };
  }

  function getLocalData(id) {
    // get data from local storage instead of the web server
    let data = localStorage.getItem(id);
    let local = JSON.parse(data);

    // reset modes if they are invalid
    if (
      local.modes == null ||
      !"danceability" in local.modes ||
      !"valence" in local.modes ||
      !"duration_ms" in local.modes ||
      Object.keys(local.modes).length > 3
    ) {
      local.modes = {
        danceability: true,
        valence: true,
        duration_ms: true,
      };
    }

    // migrate existing high scores
    if ("high_score" in local) {
      local.highScore = local.high_score;
      delete local.high_score;
    }

    return local;
  }

  function post_request(url, track_ids, timeout = 5000) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "POST",
        url,
        data: JSON.stringify({
          track_ids,
        }),
        contentType: "application/json",
        dataType: "json",
        timeout,
        success: function (data) {
          resolve(data);
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  }

  function get_request(url, timeout = 5000) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url,
        timeout,
        success: function (data) {
          resolve(data);
        },
        error: function (error) {
          reject(error);
        },
      });
    });
  }

  function processAudioFeatures(audio_features) {
    let data = {};
    audio_features.forEach((result) => {
      data[result["id"]] = result;
    });
    return data;
  }

  function getSpotifyData(
    url_artists = "/top_artists",
    url_tracks = "/top_tracks",
    url_features = "/audio_features"
  ) {
    return new Promise((resolve, reject) => {
      let data = {};
      get_request(url_artists)
        .then((result) => {
          data.top_artists = JSON.parse(result);
        })
        .then(() => {
          get_request(url_tracks)
            .then((result) => {
              data.top_tracks = JSON.parse(result);
              return (track_ids = data.top_tracks.map((track) => track.id));
            })
            .then((track_ids) => {
              post_request(url_features, track_ids).then((result) => {
                data.audio_features = processAudioFeatures(result);
                resolve(data);
              });
            })
            .catch((error) => {
              reject(error);
            });
        });
    });
  }
}
