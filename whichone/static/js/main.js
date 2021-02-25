var user = {
    top_artists: null,
    top_tracks: null,
    audio_features: null,
    expire: 0,
    high_score: 0,
    muteSound: false
};

var idList = [];
var featuresList = [];

var option1 = null;
var option2 = null;
var currentMode = "popularity";

const maxLives = 3;
var lives = maxLives;
var userCurrentScore = 0;
var stopped = false;
var paused = false;
var cheaterMode = false;
var countdownNumberEl = null;
var countdown = 10;
var refreshIntervalId = null;
var ps = 0;

$(document).ready(function () {
    $(".choice").on('click', function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (!stopped) {
            makeGuess($(this).data('choice'));
        }
    });

    $("#sign-out").on('click', function (event) {
        localStorage.clear();
    });

    $("#play-again").on('click', function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (stopped) {
            startGame();
        }
    });

    $("#mute-icon").on('click', function (event) {
        if (user.muteSound) {
            user.muteSound = false;
            document.getElementById('mute-icon').src = "/static/resources/volume-on.png";
        }
        else {
            user.muteSound = true;
            document.getElementById('mute-icon').src = "/static/resources/volume-off.png";
        }
    });

    initOptions();
    document.getElementById("mode_text").style.color = "#FFC789"
    countdownNumberEl = document.getElementById('countdown-number');
    countdownNumberEl.textContent = countdown;

    // if their spotify data exists in the browser
    // use that instead of requesting new data
    if (localDataFound()) {
        // start with a random mode
        randomMode();
        startCounter();
        setMuteIcon();
    } else {
        getSpotifyData();
        startCounter();
    }
});

function initOptions() {
    var danceBox = document.getElementById("danceBox");
    var valenceBox = document.getElementById("valenceBox");
    var durationBox = document.getElementById("durationBox");

    danceBox.checked = true;
    valenceBox.checked = true;
    durationBox.checked = true;
}