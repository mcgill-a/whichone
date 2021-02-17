var user = {
    top_artists: null,
    top_tracks: null
};

var idList = [];
var featuresList = [];
var featuresDict = null;

var option1 = null;
var option2 = null;
var currentMode = "popularity";

const maxLives = 3;
var lives = maxLives;
var userCurrentScore = 0;
var highScore = 0;
var stopped = false;
var cheaterMode = false;

$(document).ready(function () {

    // if their spotify data exists in the browser
    // use that instead of requesting new data
    if (localDataFound()) {
        // start with a random mode
        randomMode();
    } else {
        getSpotifyData();
    }

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

    initOptions();
    document.getElementById("mode_text").style.color = "#FFC789"
});

function initOptions() {
    var danceBox = document.getElementById("danceBox");
    var valenceBox = document.getElementById("valenceBox");
    var durationBox = document.getElementById("durationBox");

    danceBox.checked = true;
    valenceBox.checked = true;
    durationBox.checked = true;
}