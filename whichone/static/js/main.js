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

var option1 = null;
var option2 = null;
var currentMode = "popularity";

const MAX_LIVES = 3;
const DEFAULT_COUNTDOWN_VALUE = 12;
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
  document.getElementById("mode_text").style.color = "#FFC789";
  countdownNumberElement = document.getElementById("countdown-number");
  countdownNumberElement.textContent = countdown;
  spotify_id = $("#info").data("user");

  // if the current user has spotify data
  // in the local storage, user that
  // instead of requesting new data
  if (!localDataFound()) {
    getSpotifyData();
  }

  initOptions();
  setMuteIcon();
});

function initOptions() {
  var danceBox = document.getElementById("danceBox");
  var valenceBox = document.getElementById("valenceBox");
  var durationBox = document.getElementById("durationBox");

  danceBox.checked = user.modes.dance;
  valenceBox.checked = user.modes.upbeat;
  durationBox.checked = user.modes.duration;
}

function spotifyLogout() {
  const url = "https://accounts.spotify.com/en/logout";
  const spotifyLogoutWindow = window.open(
    url,
    "Spotify Logout",
    "width=700,height=500,top=40,left=40"
  );
  setTimeout(() => spotifyLogoutWindow.close(), 2000);
}
