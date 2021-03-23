function Controller(spotify_id, game, data, view, document, controller) {
  const EXPIRATION_TIME = 604800000; // 1 week (milliseconds)
  const sign_out = document.getElementById("sign-out");
  const play_again = document.getElementById("play-again");
  const next_question = document.getElementById("next-question");
  const mute_icon = document.getElementById("mute-icon");
  const choices = document.querySelectorAll(".choice");
  const mode_toggles = document.querySelectorAll("input[name=toggle]");

  sign_out.onclick = function () {
    game.spotifyLogout();
  };

  play_again.onclick = function () {
    game.startGame();
  };

  next_question.onclick = function () {
    game.nextQuestion();
  };

  mute_icon.onclick = function () {
    data.toggleMute();
    view.updateMuteIcon(data.isAudioEnabled());
  };

  choices.forEach((choice) => {
    choice.onclick = function () {
      game.makeGuess(choice.getAttribute("data-choice"));
    };
  });

  mode_toggles.forEach((toggle) => {
    toggle.onclick = function () {
      data.toggleMode(toggle);
    };
  });

  controller.fetchData = function fetchData(
    id = spotify_id,
    currentTime = Date.now()
  ) {
    let user = {};

    if (isLocalDataAvailable(id)) {
      user = getLocalData(id);
    } else {
      user = getDefaultData();
    }

    // if 1 week has passed or default data (0),
    // it is expired, get spotify data
    if (isLocalDataExpired(user.expire, currentTime, EXPIRATION_TIME)) {
      getSpotifyData()
        .then((spotify_data) => {
          user.top_artists = spotify_data.top_artists;
          user.top_tracks = spotify_data.top_tracks;
          user.audio_features = spotify_data.audio_features;
          user.expire = currentTime;
          // Initialise the data module using the updated user object
          data.init(user);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // Initialise the data module using the original user object
      data.init(user);
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
