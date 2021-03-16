function isLocalDataAvailable() {
  return localStorage.getItem(spotify_id) != null;
}

function isLocalDataExpired(storedTimestamp, currentTimestamp, expirationTime) {
  // check if their spotify data is outdated
  return currentTimestamp - storedTimestamp > expirationTime;
}

const isBoolean = (val) => "boolean" === typeof val;

function getLocalData(user_id) {
  // get data from local storage instead of the web server
  let data = localStorage.getItem(user_id);
  let local = JSON.parse(data);

  // check if modes are present and valid
  if (local.modes != null) {
    if (
      !isBoolean(local.modes.dance) ||
      !isBoolean(local.modes.upbeat) ||
      !isBoolean(local.modes.duration)
    ) {
      local.modes = {
        dance: true,
        upbeat: true,
        duration: true,
      };
    }
  }

  if (local.high_score == null || Number.isNaN(local.high_score)) {
    local.high_score = 0;
  }
  return local;
}

async function post_request(url, track_ids) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url,
      data: JSON.stringify({
        track_ids,
      }),
      contentType: "application/json",
      dataType: "json",
      timeout: 5000,
      success: function (data) {
        resolve(data);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

async function get_request(url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url,
      timeout: 5000,
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

async function getSpotifyData(
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

function storeEnabledModes() {
  user.modes.dance = danceBox.checked;
  user.modes.upbeat = valenceBox.checked;
  user.modes.duration = durationBox.checked;
  localStorage.setItem(spotify_id, JSON.stringify(user));
}
