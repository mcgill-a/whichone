function localDataFound() {
  // get data from local storage instead of the web server
  let data = localStorage.getItem(spotify_id);
  const EXPIRATION_TIME = 604800000; // 1 week (milliseconds)

  if (data != null) {
    user = JSON.parse(data);
    // check if modes are present
    let resetModes = false;
    if (user.modes != null) {
      if (
        user.modes.dance == null ||
        user.modes.upbeat == null ||
        user.modes.duration == null
      ) {
        resetModes = true;
      }
    } else {
      resetModes = true;
    }

    if (resetModes) {
      user.modes = {
        dance: true,
        upbeat: true,
        duration: true,
      };
    }

    if (user.high_score != null) {
      if (Number.isNaN(user.high_score)) {
        user.high_score = 0;
      } else {
        document.getElementById("high_score-m").textContent = user.high_score;
        document.getElementById("high_score-d").textContent = user.high_score;
      }
    } else {
      user.high_score = 0;
    }

    // check if their spotify data is outdated
    if (user.expire != null) {
      // If the expiration time has passed, we need to get new data instead of using the local storage
      if (new Date().getTime() - new Date(user.expire) > EXPIRATION_TIME) {
        return false;
      }
    } else {
      return false;
    }

    return true;
  } else {
    return false;
  }
}

async function getAudioFeatures() {
  let trackIds = [];
  if (user.top_tracks != null && user.top_tracks.length > 0) {
    user.top_tracks.forEach((track) => {
      trackIds.push(track.id);
    });

    $.ajax({
      type: "POST",
      url: "/audio_features",
      data: JSON.stringify({
        track_ids: trackIds,
      }),
      contentType: "application/json",
      dataType: "json",
      success: function (data) {
        user["audio_features"] = {};
        data.forEach((result) => {
          user["audio_features"][result["id"]] = result;
        });
        user["expire"] = new Date().getTime();
        localStorage.setItem(spotify_id, JSON.stringify(user));
      },
      error: function () {
        console.error("API unavailable. Please try again later.");
        user["audio_features"] = {};
      },
      timeout: 3000,
    });
  } else {
    console.error("Audio features unavailable (no tracks loaded).");
  }
}

async function request(key, callback) {
  $.ajax({
    type: "GET",
    url: "/" + key,
    success: function (data) {
      user[key] = JSON.parse(data);
      user["expire"] = new Date().getTime();
      localStorage.setItem(spotify_id, JSON.stringify(user));
      if (callback != null) {
        callback();
      }
    },
    error: function () {
      console.error("API unavailable. Please try again later.");
    },
    timeout: 5000,
  });
}

async function getSpotifyData() {
  await request("top_artists", null);
  await request("top_tracks", getAudioFeatures);
}

function storeEnabledModes() {
  user.modes.dance = danceBox.checked;
  user.modes.upbeat = valenceBox.checked;
  user.modes.duration = durationBox.checked;
  localStorage.setItem(spotify_id, JSON.stringify(user));
}
