// data_mod.js
function Data(input, output) {
  const args = input;
  const EXPIRATION_TIME = 604800000; // 1 week (milliseconds)
  const isBoolean = (val) => "boolean" === typeof val;

  initialiseData();

  output.isDataReady = function isDataReady() {
    return  output.user.top_artists !== null &&
            output.user.top_tracks !== null &&
            output.audio_features !== null;
  };

  output.toggleMute = function toggleMute() {
    output.user.muteSound = !output.user.muteSound;
    updateLocalUser(args.spotify_id);
  };

  output.toggleMode = function toggleMode(
    toggle,
    id = args.spotify_id
  ) {
    output.user.modes[toggle.id] = toggle.checked;
    updateLocalUser(id);
  };

  function initialiseData(currentTime = Date.now(), id = args.spotify_id) {
    if (isLocalDataAvailable(id)) {
      output.user = getLocalData(id);
    } else {
      output.user = {
        top_artists: null,
        top_tracks: null,
        audio_features: null,
        expire: 0,
        highScore: 0,
        scores: [],
        muteSound: false,
        modes: {
          danceability: true,
          valence: true,
          duration: true,
        },
      };
    }

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
  }

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

  function getLocalData(id) {
    // get data from local storage instead of the web server
    let data = localStorage.getItem(id);
    let local = JSON.parse(data);

    // check if modes are present and valid
    if (local.modes !== null) {
      if (
        !isBoolean(local.modes.dance) ||
        !isBoolean(local.modes.valence) ||
        !isBoolean(local.modes.duration)
      ) {
        local.modes = {
          dance: true,
          valence: true,
          duration: true,
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
