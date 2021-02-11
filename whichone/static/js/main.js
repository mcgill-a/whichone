var user = {
    top_artists: null,
    top_tracks: null
};

var idList = [];
var featuresList = [];
var featuresDict = {};

var option1 = null;
var option2 = null;
var currentMode = "popularity";

const maxLives = 3;
var lives = maxLives;
var userCurrentScore = 0;
var highScore = 0;


var cheaterMode = false;

$(document).ready(function () {

    getSpotifyData();

    $(".choice").on('click', function (event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        makeGuess($(this).data('choice'));
    });
});

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
            data.forEach(result => {
                featuresDict[result['id']] = result;
            });
        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });
}


async function getSpotifyData() {

    let artists = await makeRequest("top_artists");
    if (artists == [] || artists == undefined || !artists) {
        console.error("No data returned from API (param1)");
    } else if (artists) {
        user['top_artists'] = artists;
    }

    let tracks = await makeRequest("top_tracks");
    if (tracks == [] || tracks == undefined || !tracks) {
        console.error("No data returned from API (param2)");
    } else if (tracks) {
        user['top_tracks'] = tracks;
    }

    getAudioFeatures(tracks);
    compareArtists();
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
        while (option1 == null || option2 == null || num1 == num2 || option1['popularity'] == option2['popularity']) {

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
        while (option1 == null || option2 == null || num1 == num2 ||
            option1[currentMode] == option2[currentMode]) {
                
            // switch the index for option2
            num2 = Math.floor(Math.random() * numTracks);

            option1 = trackList[num1];
            option1['danceability'] = featuresDict[option1['id']]['danceability'];
            option1['valence'] = featuresDict[option1['id']]['valence'];
            option1['duration'] = featuresDict[option1['id']]['duration_ms'];
            option2 = trackList[num2];
            option2['danceability'] = featuresDict[option2['id']]['danceability'];
            option2['valence'] = featuresDict[option2['id']]['valence'];
            option2['duration'] = featuresDict[option2['id']]['duration_ms'];
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

        document.getElementById("image1").src = option1['album']['images'][1]['url'];;
        document.getElementById("image2").src = option2['album']['images'][1]['url'];
    }
}


function makeGuess(option) {
    if (option == null || option1 == null || option2 == null) {
        console.log("There is a problem, an option is null");
    } else if (
        (option == '1' && option1[currentMode] > option2[currentMode]) ||
        (option == '2' && option2[currentMode] > option1[currentMode])) {
        //correct answer
        userCurrentScore += 1;
        updateLives();
        document.getElementById("current_score").textContent = userCurrentScore;
    } else {
        // wrong answer
        lives -= 1;
        updateLives();
        if (lives == 0) {
            console.log("Game over. Final score: " + userCurrentScore);
            updateHighScore(userCurrentScore);
            userCurrentScore = 0;
            lives = maxLives;
            updateLives();
            document.getElementById("current_score").textContent = userCurrentScore;
        }
    }

    console.log(option1[currentMode], option2[currentMode]);

    choiceNum = Math.random();
    if (choiceNum < 0.2) {
        currentMode = "popularity";
        compareArtists();
    } else if (choiceNum >= 0.2 && choiceNum < 0.4) {
        currentMode = "popularity";
        compareTracks();
    } else if (choiceNum >= 0.4 && choiceNum < 0.6) {
        currentMode = "danceability";
        compareTracks();
    } else if (choiceNum >= 0.6 && choiceNum < 0.8) {
        currentMode = "duration";
        compareTracks();
    } else {
        currentMode = "valence";
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
        highScore = 0;
    }
    if (cheaterMode) {
        icon1.src = "/static/resources/spotify-icon-red.png";
        icon2.src = "/static/resources/spotify-icon-red.png";
        icon3.src = "/static/resources/spotify-icon-red.png";
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