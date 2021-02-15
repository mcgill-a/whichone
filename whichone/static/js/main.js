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
        makeGuess($(this).data('choice'));
    });

    $(".spotify-logout").on('click', function (event) {
        localStorage.clear();
    });

    init_options();
});

function localDataFound() {
    // get data from local storage instead of the web server
    let tracks = localStorage.getItem("top_tracks");
    let artists = localStorage.getItem("top_artists");
    let features = localStorage.getItem("audio_features");
    if (tracks != null && artists != null && features != null) {
        user['top_artists'] = JSON.parse(artists);
        user['top_tracks'] = JSON.parse(tracks);
        featuresDict = JSON.parse(features);
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
        localStorage.setItem("top_artists", JSON.stringify(artists));
    }

    let tracks = await makeRequest("top_tracks");
    if (tracks == [] || tracks == undefined || !tracks) {
        console.error("No data returned from API (param2)");
    } else if (tracks) {
        user['top_tracks'] = tracks;
        localStorage.setItem("top_tracks", JSON.stringify(tracks));
    }

    compareArtists();
    getAudioFeatures(tracks);
}


function updateMode(mode, mode_text) {
    document.getElementById("mode_intro").textContent = "Which ";
    document.getElementById("mode").textContent = mode;
    document.getElementById("mode_text").textContent = mode_text;
}


function updateHighScore(score) {
    if (score > highScore) {
        highScore = score;
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

        updateMode("artist", " have you listened to more?");

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
            updateMode("track", " have you listened to more?");
        } else if (currentMode == "danceability") {
            updateMode("track", " is more danceable?");
        } else if (currentMode == "valence") {
            updateMode("track", " is more upbeat?");
        } else if (currentMode == "duration") {
            updateMode("track", " is longer?");
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
                console.log("Game over. Final score: " + userCurrentScore);
                updateHighScore(userCurrentScore);
                document.getElementById("stats-text").textContent = "Game Over";
                document.getElementById("stats-text").style.color = "red";
                updateLives();

                lives = maxLives;
                userCurrentScore = 0;
                document.getElementById("current_score").textContent = userCurrentScore;
            }
        }

        $("#stats-popup").removeClass("hidden");

        console.log(option1[currentMode], option2[currentMode]);



        randomMode();
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
        document.getElementById("stats-text").textContent = bigChoice + " is " + timesMore + " x more danceable than " + smallChoice + ".";
    } else if (currentMode == 'valence') {
        document.getElementById("stats-text").textContent = bigChoice + " is " + timesMore + " x more upbeat than " + smallChoice + ".";
    } else if (currentMode == 'duration') {
        if (durationMore == 1) {
            plural = "";
        }
        document.getElementById("stats-text").textContent = bigChoice + " is " + durationMore + " second" + plural + " longer than " + smallChoice + ".";
    } else if (currentMode == 'popularity') {
        document.getElementById("stats-text").textContent = "You have listened to " + bigChoice + " " + timesMore + " x more than " + smallChoice + ".";
    }
}

function init_options() {
    var danceBox = document.getElementById("danceBox");
    var valenceBox = document.getElementById("valenceBox");
    var durationBox = document.getElementById("durationBox");

    danceBox.checked = true;
    valenceBox.checked = true;
    durationBox.checked = true;
}