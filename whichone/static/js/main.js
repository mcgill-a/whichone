var user = {
  top_artists: null,
  top_tracks: null,
  audio_features: null,
  expire: 0,
  high_score: 0,
  scores: [],
  muteSound: false,
  modes: {
    dance: true,
    upbeat: true,
    duration: true,
  },
};

const MAX_LIVES = 3;
const DEFAULT_COUNTDOWN_VALUE = 12;
const EXPIRATION_TIME = 604800000; // 1 week (milliseconds)
const sounds = {
  correct: "/static/resources/correct.mp3",
  wrong: "/static/resources/wrong.mp3",
  gameover: "/static/resources/gameover.mp3",
  gameover10: "/static/resources/gameover_10plus.mp3",
};

var option1 = null;
var option2 = null;
var currentMode = "popularity";
var spotify_id = null;
var lives = MAX_LIVES;
var userCurrentScore = 0;
var stopped = true;
var paused = false;
var cheaterMode = false;
var countdownNumberElement = null;
var countdown = DEFAULT_COUNTDOWN_VALUE;
var refreshIntervalId = null;
var ps = 0;

$(document).ready(function () {
  spotify_id = $("#info").data("user");
  initData();
  initOptions();
  setMuteIcon();
});

async function initData(currentTime = Date.now()) {
  if (isLocalDataAvailable()) {
    user = getLocalData(spotify_id);
  }
  if (isLocalDataExpired(user.expire, currentTime, EXPIRATION_TIME)) {
    getSpotifyData()
      .then((data) => {
        user.top_artists = data.top_artists;
        user.top_tracks = data.top_tracks;
        user.audio_features = data.audio_features;
        user["expire"] = currentTime;
        localStorage.setItem(spotify_id, JSON.stringify(user));
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

function initOptions() {
  var danceBox = document.getElementById("danceBox");
  var valenceBox = document.getElementById("valenceBox");
  var durationBox = document.getElementById("durationBox");

  danceBox.checked = user.modes.dance;
  valenceBox.checked = user.modes.upbeat;
  durationBox.checked = user.modes.duration;
}

async function spotifyLogout() {
  const url = "https://accounts.spotify.com/en/logout";
  const spotifyLogoutWindow = window.open(
    url,
    "Spotify Logout",
    "width=700,height=500,top=40,left=40"
  );
  
  await new Promise(() => setTimeout(() => spotifyLogoutWindow.close(), 2000));
}
