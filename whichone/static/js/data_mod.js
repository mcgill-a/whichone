// data_mod.js
function Data(input, output) {
  const args = input;
  const EXPIRATION_TIME = 604800000; // 1 week (milliseconds)
  const isBoolean = (val) => val != null && "boolean" === typeof val;

  output.updateHighScore = function updateHighScore(score) {
    output.user.highScore = score;
    updateLocalUser(args.spotify_id);
  };

  output.isDataReady = function isDataReady() {
    return (
      output.user.top_artists !== null &&
      output.user.top_tracks !== null &&
      output.audio_features !== null
    );
  };

  output.isAudioEnabled = function isAudioEnabled() {
    return output.user.audioEnabled;
  };

  output.toggleMute = function toggleMute() {
    output.user.audioEnabled = !output.user.audioEnabled;
    updateLocalUser(args.spotify_id);
  };

  output.toggleMode = function toggleMode(toggle, id = args.spotify_id) {
    output.user.modes[toggle.id] = toggle.checked;
    updateLocalUser(id);
  };

  output.init = function init(currentTime = Date.now(), id = args.spotify_id) {
    if (isLocalDataAvailable(id)) {
      output.user = getLocalData(id);
      updateLocalUser(id);
    } else {
      output.user = getDefaultData();
    }
    // now that data has been loaded, setup the page settings
    args.initialisePage(output.user.audioEnabled, output.user.modes);

    // if 1 week has passed or default data (0),
    // it is expired, get spotify data
    if (isLocalDataExpired(output.user.expire, currentTime, EXPIRATION_TIME)) {
      getSpotifyData()
        .then((data) => {
          output.user.top_artists = data.top_artists;
          output.user.top_tracks = data.top_tracks;
          output.user.audio_features = data.audio_features;
          output.user.expire = currentTime;
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

  function updateLocalUser(id, userObject = output.user) {
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

    // reset modes if they are not valid
    if (local.modes !== null) {
      if (
        !isBoolean(local.modes.danceability) ||
        !isBoolean(local.modes.valence) ||
        !isBoolean(local.modes.duration_ms)
      ) {
        local.modes = {
          danceability: true,
          valence: true,
          duration_ms: true,
        };
      }
    }

    if (local.highScore === null || Number.isNaN(local.highScore)) {
      local.highScore = 0;
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
    let output = {};
    audio_features.forEach((result) => {
      output[result["id"]] = result;
    });
    return output;
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
