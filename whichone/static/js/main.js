var user = {
    top_artists: null,
    top_tracks: null,
    audio_features: null,
    expire: 0,
    high_score: 0,
    scores: [],
    muteSound: false,
};

var option1 = null;
var option2 = null;
var currentMode = "popularity";

const MAX_LIVES = 3;
const DEFAULT_COUNTDOWN_VALUE = 12;

var lives = MAX_LIVES;
var userCurrentScore = 0;
var stopped = false;
var paused = false;
var cheaterMode = false;
var countdownNumberElement = null;
var countdown = DEFAULT_COUNTDOWN_VALUE;
var refreshIntervalId = null;
var ps = 0;

$(document).ready(function () {
    $(".choice").on('click', function () {
        if (!paused && !stopped) {
            makeGuess($(this).data('choice'));
        }
    });

  $("#sign-out").on("click", function (event) {
    localStorage.clear();
    spotifyLogout();
  });

    $("#play-again").on('click', function () {
        if (stopped) {
            startGame();
        }
    });

    $("#stat-next").on('click', function () {
        if (!stopped) {
            nextScreen();
        }
    });

    $("#mute-icon").on("click", function (event) {
        if (user.muteSound) {
            user.muteSound = false;
            document.getElementById("mute-icon").src =
                "/static/resources/volume-on.png";
        } else {
            user.muteSound = true;
            document.getElementById("mute-icon").src =
                "/static/resources/volume-off.png";
        }
        localStorage.setItem("user", JSON.stringify(user));
    });

    initOptions();
    document.getElementById("mode_text").style.color = "#FFC789"
    countdownNumberElement = document.getElementById('countdown-number');
    countdownNumberElement.textContent = countdown;

    // if their spotify data exists in the browser
    // use that instead of requesting new data
    if (localDataFound()) {
        // start with a random mode
        randomMode();
        startCounter();
    } else {
        getSpotifyData();
        startCounter();
    }
    setMuteIcon();
});

function initOptions() {
    var danceBox = document.getElementById("danceBox");
    var valenceBox = document.getElementById("valenceBox");
    var durationBox = document.getElementById("durationBox");

    danceBox.checked = true;
    valenceBox.checked = true;
    durationBox.checked = true;
}

function spotifyLogout() {
    const url = 'https://accounts.spotify.com/en/logout';
    const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40');
    setTimeout(() => spotifyLogoutWindow.close(), 2000);
}