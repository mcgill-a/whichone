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

    $(".play-again").on('click', function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (stopped) {
            startGame();
        }
    });

    initOptions();
    document.getElementById("mode_text").style.color = "#FFC789"
});

function localDataFound() {
    // get data from local storage instead of the web server
    let expire = localStorage.getItem("expire");
    let tracks = localStorage.getItem("top_tracks");
    let artists = localStorage.getItem("top_artists");
    let features = localStorage.getItem("audio_features");
    let score = localStorage.getItem("high_score");

    const EXPIRATION_TIME = 604800000; // 1 week (milliseconds)

    if (expire != null) {
        // If the expiration time has passed, we need to get new data instead of using the local storage
        if (new Date().getTime() - new Date(JSON.parse(expire)) > EXPIRATION_TIME) {
            return false;
        }
    }

    if (tracks != null && artists != null && features != null) {
        user['top_artists'] = JSON.parse(artists);
        user['top_tracks'] = JSON.parse(tracks);
        featuresDict = JSON.parse(features);

        if (score != null) {
            highScore = parseInt(score, 10);
            if (Number.isNaN(highScore)) {
                highScore = 0;
            } else {
                document.getElementById("high_score").textContent = highScore;
            }
        }

        return true;
    } else {
        return false;
    }
}

async function makeRequest(param) {
    try {
        let url = "/" + param;
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("API unavailable. Please try again later.");
    }
}

function showChoices(scale = false) {
    $('.play-again').addClass("hidden");
    $('.choice').removeClass("slow-transition");
    $('.choice').addClass("fast-transition");
    $('.choice').css('cursor', 'pointer');

    if (scale) {
        $('.choice').css('transform', 'scale(1)');
    } else {
        $('.choice').css('opacity', '1');
    }
}

function hideChoices(scale = false) {
    $('.choice').removeClass("fast-transition");
    $('.choice').addClass("slow-transition");
    $('.choice').css('cursor', 'default');
    if (scale) {
        $('.choice').css('transform', 'scale(0)');
    } else {
        $('.choice').css('opacity', '0');
    }
    $('.play-again').removeClass("hidden");
}

function stopGame() {
    stopped = true;
    console.log("Game over. Final score: " + userCurrentScore);
    updateHighScore(userCurrentScore);
    updateMode("Game Over", "");

    updateLives();
    lives = maxLives;
    document.getElementById("current_score").textContent = userCurrentScore;
    document.getElementById("final_score").textContent = "You Scored " + userCurrentScore + "!"
    userCurrentScore = 0;
    hideChoices();
}

function startGame() {    
    document.getElementById("current_score").textContent = userCurrentScore;
    stopped = false;
    randomMode();
    showChoices();
    lives = 3;
    updateLives();
}

async function getAudioFeatures(tracks) {
    let trackIds = [];

    if (tracks != null) {
        tracks.items.forEach(track => {
            trackIds.push(track.id);
        });

        $.ajax({
            type: "POST",
            url: "/audio_features",
            data: JSON.stringify({
                "track_ids": trackIds
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                featuresDict = {};
                data.forEach(result => {
                    featuresDict[result['id']] = result;
                });
                localStorage.setItem("expire", JSON.stringify(new Date().getTime()));
                localStorage.setItem("audio_features", JSON.stringify(featuresDict));
            },
            error: function (errMsg) {
                console.log(errMsg);
            }
        });
    }
}


async function getSpotifyData() {

    let artists = await makeRequest("top_artists");
    if (artists == [] || artists == undefined || !artists) {
        console.error("No data returned from API (param1)");
    } else if (artists) {
        user['top_artists'] = artists;
        localStorage.setItem("expire", JSON.stringify(new Date().getTime()));
        localStorage.setItem("top_artists", JSON.stringify(artists));
    }

    let tracks = await makeRequest("top_tracks");
    if (tracks == [] || tracks == undefined || !tracks) {
        console.error("No data returned from API (param2)");
    } else if (tracks) {
        user['top_tracks'] = tracks;
        localStorage.setItem("expire", JSON.stringify(new Date().getTime()));
        localStorage.setItem("top_tracks", JSON.stringify(tracks));
    }

    compareArtists();
    getAudioFeatures(tracks);
}


function updateMode(mode_intro, mode_text) {
    document.getElementById("mode_intro").textContent = mode_intro;
    document.getElementById("mode_text").textContent = mode_text;

    document.getElementById("mode_intro").style.color = "whitesmoke";
    document.getElementById("question_mark").textContent = "?";

    if (mode_intro == "Game Over") {
        document.getElementById("mode_intro").style.color = "#FF4343";
        document.getElementById("question_mark").textContent = "";
    }

    if (mode_text == "listened to more") {
        document.getElementById("mode_text").style.color = "#FFC789";
    } else if (mode_text == "danceable") {
        document.getElementById("mode_text").style.color = "#EC89FF";
    } else if (mode_text == "upbeat") {
        document.getElementById("mode_text").style.color = "#A0FF89";
    } else if (mode_text == "longer") {
        document.getElementById("mode_text").style.color = "#9091FF";
    } else {
        document.getElementById("mode_text").style.color = "whitesmoke";
    }
}


function updateHighScore(score) {
    if (score > highScore && !cheaterMode) {
        highScore = score;
        localStorage.setItem("high_score", highScore);
    }

    document.getElementById("high_score").textContent = highScore;
}

function compareArtists() {
    if (user.top_artists == [] || user.top_artists == undefined || !user.top_artists) {
        console.error("No data")
    } else {
        artistList = user.top_artists['items'];
        numTracks = artistList.length;
        num1 = Math.floor(Math.random() * numTracks);

        option1 = null;
        option2 = null;

        // reference numbers cannot match
        while (option1 == null || option2 == null || num1 == num2 ||
            option1[currentMode] == option2[currentMode]) {

            // switch the index for option2
            num2 = Math.floor(Math.random() * numTracks);

            option1 = artistList[num1];
            option2 = artistList[num2];
        }

        updateMode("Which artist have you ", "listened to more");

        document.getElementById("text1a").textContent = option1['name'];
        document.getElementById("text2a").textContent = option2['name'];

        document.getElementById("image1").src = option1['images'][1]['url'];
        document.getElementById("image2").src = option2['images'][1]['url'];
        $('.choice').css('opacity', '1');
    }
}

function compareTracks() {
    if (user.top_tracks == [] || user.top_tracks == undefined || !user.top_tracks) {
        console.error("No data")
    } else {
        trackList = user.top_tracks['items'];

        numTracks = trackList.length;
        num1 = Math.floor(Math.random() * numTracks);

        option1 = null;
        option2 = null;

        // reference numbers cannot match
        while (option1 == null || option2 == null ||
            option1[currentMode] == option2[currentMode] ||
            option1['name'] == option2['name']) {

            // switch the index for option2
            num2 = Math.floor(Math.random() * numTracks);

            option1 = trackList[num1];
            option2 = trackList[num2];

            // if features dict hasn't been initialised yet, just use popularity
            if (featuresDict == null) {
                currentMode = "popularity";
            } else {
                option1['danceability'] = featuresDict[option1['id']]['danceability'];
                option1['valence'] = featuresDict[option1['id']]['valence'];
                option1['duration'] = featuresDict[option1['id']]['duration_ms'];

                option2['danceability'] = featuresDict[option2['id']]['danceability'];
                option2['valence'] = featuresDict[option2['id']]['valence'];
                option2['duration'] = featuresDict[option2['id']]['duration_ms'];
            }
        }

        if (currentMode == "popularity") {
            updateMode("Which track have you ", "listened to more");
        } else if (currentMode == "danceability") {
            updateMode("Which track is more ", "danceable");
        } else if (currentMode == "valence") {
            updateMode("Which track is more ", "upbeat");
        } else if (currentMode == "duration") {
            updateMode("Which track is ", "longer");
        }

        document.getElementById("text1a").textContent = option1['name'];
        document.getElementById("text2a").textContent = option2['name'];

        document.getElementById("image1").src = option1['album']['images'][1]['url'];
        document.getElementById("image2").src = option2['album']['images'][1]['url'];
        $('.choice').css('opacity', '1');
    }
}


function makeGuess(option) {
    if (option == null || option1 == null || option2 == null) {
        // data hasn't loaded yet
    } else {
        document.getElementById("stats-text").textContent = "";
        document.getElementById("stats-text").style.color = "white";

        if (
            (option == '1' && option1[currentMode] > option2[currentMode]) ||
            (option == '2' && option2[currentMode] > option1[currentMode])) {
            //correct answer
            userCurrentScore += 1;
            updateLives();
            document.getElementById("current_score").textContent = userCurrentScore;
            getStats(option1[currentMode], option2[currentMode]);
        } else {
            // wrong answer
            lives -= 1;
            updateLives();
            getStats(option1[currentMode], option2[currentMode]);
            if (lives == 0) {
                stopGame();
            }
        }

        if (!stopped) {
            randomMode();
        }

        $("#stats-popup").removeClass("hidden");
        console.log(option1[currentMode], option2[currentMode]);
    }
}

function randomMode() {

    choiceArray = ["popularity", "popularity"];

    if (danceBox.checked) {
        choiceArray.push("danceability");
    }
    if (valenceBox.checked) {
        choiceArray.push("valence");
    }
    if (durationBox.checked) {
        choiceArray.push("duration");
    }

    currentMode = choiceArray[Math.floor(Math.random() * choiceArray.length)];

    choiceNum = Math.random();
    if (choiceNum < 0.5 && currentMode == "popularity") {
        compareArtists();
    } else if (choiceNum >= 0.5 && currentMode == "popularity") {
        compareTracks();
    } else if (currentMode == "danceability") {
        compareTracks();
    } else if (currentMode == "duration") {
        compareTracks();
    } else { // currentMode == "valence"
        compareTracks();
    }
}

function updateLives() {

    icon1 = document.getElementById("life1");
    icon2 = document.getElementById("life2");
    icon3 = document.getElementById("life3");
    if (Number.isNaN(lives) || lives > 3) {
        cheaterMode = true;
        console.log("Cheater mode enabled.");
    }
    if (cheaterMode) {
        icon1.src = "/static/resources/spotify-icon-red.png";
        icon2.src = "/static/resources/spotify-icon-red.png";
        icon3.src = "/static/resources/spotify-icon-red.png";
        highScore = 0;
    } else if (lives == 3) {
        icon1.src = "/static/resources/spotify-icon.png";
        icon2.src = "/static/resources/spotify-icon.png";
        icon3.src = "/static/resources/spotify-icon.png";
    } else if (lives == 2) {
        icon1.src = "/static/resources/spotify-icon.png";
        icon2.src = "/static/resources/spotify-icon.png";
        icon3.src = "/static/resources/spotify-icon-black.png";
    } else if (lives == 1) {
        icon1.src = "/static/resources/spotify-icon.png";
        icon2.src = "/static/resources/spotify-icon-black.png";
        icon3.src = "/static/resources/spotify-icon-black.png";
    } else {
        icon1.src = "/static/resources/spotify-icon-black.png";
        icon2.src = "/static/resources/spotify-icon-black.png";
        icon3.src = "/static/resources/spotify-icon-black.png";
    }

}

function getStats(param1, param2) {

    var big = null;
    var small = null;

    var bigChoice = null;
    var smallChoice = null;

    choice1 = document.getElementById("text1a").textContent;
    choice2 = document.getElementById("text2a").textContent;

    if (param1 > param2) {
        big = param1;
        small = param2;

        bigChoice = choice1;
        smallChoice = choice2;

    } else {
        big = param2;
        small = param1;

        bigChoice = choice2;
        smallChoice = choice1;
    }

    timesMore = Math.round((big / small) * 10) / 10;
    if (timesMore == Infinity) {
        timesMore = "a lot";
    } else if (timesMore == 1) {
        timesMore = 1.1;
    }
    amountMore = Math.round((big - small) * 10) / 10;

    durationMore = amountMore / 1000;
    durationMore = Math.round(durationMore);

    plural = "s";

    if (currentMode == 'danceability') {
        document.getElementById("stats-text").textContent = bigChoice + " is " + timesMore + "x more danceable than " + smallChoice + ".";
    } else if (currentMode == 'valence') {
        document.getElementById("stats-text").textContent = bigChoice + " is " + timesMore + "x more upbeat than " + smallChoice + ".";
    } else if (currentMode == 'duration') {
        if (durationMore == 1) {
            plural = "";
        }
        document.getElementById("stats-text").textContent = bigChoice + " is " + durationMore + " second" + plural + " longer than " + smallChoice + ".";
    } else if (currentMode == 'popularity') {
        document.getElementById("stats-text").textContent = "You have listened to " + bigChoice + " " + timesMore + "x more than " + smallChoice + ".";
    }
}

function initOptions() {
    var danceBox = document.getElementById("danceBox");
    var valenceBox = document.getElementById("valenceBox");
    var durationBox = document.getElementById("durationBox");

    danceBox.checked = true;
    valenceBox.checked = true;
    durationBox.checked = true;
}