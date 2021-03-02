var user = {
    top_artists: null,
    top_tracks: null,
    audio_features: null,
    expire: 0,
    high_score: 0,
    scores: []
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
var countdown = 12;
var refreshIntervalId = null;
var ps = 0;

$(document).ready(function () {
    $(".choice").on('click', function () {
        if (!paused && !stopped) {
            makeGuess($(this).data('choice'));
        }
    });

    $("#sign-out").on('click', function () {
        localStorage.clear();
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