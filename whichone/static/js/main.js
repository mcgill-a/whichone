var user = {
    top_artists: null,
    top_tracks: null
};

var idList = [];
var featuresList = [];
var featuresDict = {};
var highScore = 0;

window.onload = function () {
    loadWindow();
}

var option1 = null;
var option2 = null;

userCurrentScore = 0;
maxLives = 3;
lives = maxLives;

async function loadWindow() {
    process("top_artists", "top_tracks");
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

async function makePostRequest(url, inputBody) {
    $.ajax({
        type: "POST",
        url: url,
        data: JSON.stringify({
            "track_ids": inputBody
        }),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            doWork(data);
        },
        error: function (errMsg) {
            console.log(errMsg);
        }
    });
}


async function process(param1, param2) {

    let result1 = await makeRequest(param1);
    if (result1 == [] || result1 == undefined || !result1) {
        console.error("No data returned from API (param1)");
    } else if (result1) {
        user[param1] = result1;
    }

    let result2 = await makeRequest(param2);
    if (result2 == [] || result2 == undefined || !result2) {
        console.error("No data returned from API (param2)");
    } else if (result2) {
        user[param2] = result2;
    }

    listTrackIDs(result2);
    compareArtists();
}

async function listTrackIDs(input) {

    //for track in JSON object list, get track ID and add to list

    items = input.items;

    for (i = 0; i < items.length; i++) {
        idList.push(items[i].id);
    }

    postInput = JSON.parse(JSON.stringify(idList)); // convert idList a JSON object
    makePostRequest("/audio_features", postInput);
}

function doWork(results) {
    if (results != null) {
        results.forEach(result => {
            featuresDict[result['id']] = result;
        });
        console.log(featuresDict);
    } else {
        console.error("Audio features unavailable");
    }
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

        // accesses "items" section of JSON
        // lists all the artists in the items
        artistList = user.top_artists['items'];

        // creates 2 reference numbers from available numbers
        listLen = artistList.length;
        num1 = Math.floor(Math.random() * listLen);
        num2 = Math.floor(Math.random() * listLen);

        option1 = null;
        option2 = null;

        // reference numbers cannot match
        while (option1 == null || option2 == null || num1 == num2) {
            //option1['popularity'] == option1['popularity']) {
            
            // switch the index for option2
            num2 = Math.floor(Math.random() * listLen);

            option1 = artistList[num1];
            option2 = artistList[num2];

            console.log(option1);
            console.log(option2);
            break;
        }

        updateMode("artist", " have you listened to more?");

        document.getElementById("text1a").textContent = option1['name'];
        document.getElementById("text2a").textContent = option2['name'];

        document.getElementById("image1").src = option1['images'][1]['url'];;
        document.getElementById("image2").src = option2['images'][1]['url'];

    }
}

function compareTracks() {

    if (user.top_tracks == [] || user.top_tracks == undefined || !user.top_tracks) {
        console.error("No data")
    } else {
        // accesses "items" section of JSON
        // lists all the tracks in the items
        trackList = user.top_tracks['items'];

        // creates 2 reference numbers from available numbers
        listLen = trackList.length;
        num1 = Math.floor(Math.random() * listLen);
        num2 = Math.floor(Math.random() * listLen);

        option1 = null;
        option2 = null;

        // reference numbers cannot match
        while (option1 == null || option2 == null || num1 == num2 ||
            option1['popularity'] == option1['popularity']) {
            
            // switch the index for option2
            num2 = Math.floor(Math.random() * listLen);

            option1 = trackList[num1];
            option2 = trackList[num2];
            break;
        }

        updateMode("track", " have you listened to more?");

        document.getElementById("text1a").textContent = option1['name'];
        document.getElementById("text2a").textContent = option2['name'];

        document.getElementById("image1").src = option1['album']['images'][1]['url'];;
        document.getElementById("image2").src = option2['album']['images'][1]['url'];
    }
}

function makeGuess(option) {

    if (option == null || option1 == null || option2 == null) {
        console.log("There is a problem, an option is null");

    } else if (option == '1') {
        if (option1['popularity'] > option2['popularity']) {
            //correct answer
            userCurrentScore += 1;
            updateLives();
            document.getElementById("current_score").textContent = userCurrentScore;
        } else if (option2['popularity'] > option1['popularity']) {
            // wrong answer
            lives -= 1;
            console.log("wrong -1 life, lives = " + lives);
            updateLives();
            if (lives == 0) {
                console.log("0 lives u lose");
                updateHighScore(userCurrentScore);
                userCurrentScore = 0;
                lives = maxLives;
                document.getElementById("current_score").textContent = userCurrentScore;
            }
        } else {
            // neutral answer, error or same pop
            console.log("same");
            updateLives();
        }
    } else if (option == '2') {
        if (option2['popularity'] > option1['popularity']) {
            //correct answer
            userCurrentScore += 1;
            updateLives();
            document.getElementById("current_score").textContent = userCurrentScore;
        } else if (option1['popularity'] > option2['popularity']) {
            // wrong answer
            lives -= 1;
            updateLives();
            console.log("wrong -1 life, lives = " + lives);
            if (lives == 0) {
                console.log("0 lives u lose");
                updateHighScore(userCurrentScore);
                userCurrentScore = 0;
                lives = maxLives;
                document.getElementById("current_score").textContent = userCurrentScore;
            }
        } else {
            // neutral answer, error or same pop
            console.log("same");
            updateLives();
        }
    } else {
        //something has gone wrong
        console.log("hmmmmm");
        updateLives();
    }

    choiceNum = Math.random();
    if (choiceNum < 0.5) {
        compareArtists();
    } else if (choiceNum >= 0.5) {
        compareTracks();
    }
}

function updateLives() {

    icon1 = document.getElementById("life1");
    icon2 = document.getElementById("life2");
    icon3 = document.getElementById("life3");

    if (lives == 3) {
        icon1.src = "{{url_for('static', filename='resources/spotify-icon.png')}}";
        icon2.src = "{{url_for('static', filename='resources/spotify-icon.png')}}";
        icon3.src = "{{url_for('static', filename='resources/spotify-icon.png')}}";
    } else if (lives == 2) {
        icon1.src = "{{url_for('static', filename='resources/spotify-icon.png')}}";
        icon2.src = "{{url_for('static', filename='resources/spotify-icon.png')}}";
        icon3.src = "{{url_for('static', filename='resources/spotify-icon-black.png')}}";
    } else if (lives == 1) {
        icon1.src = "{{url_for('static', filename='resources/spotify-icon.png')}}";
        icon2.src = "{{url_for('static', filename='resources/spotify-icon-black.png')}}";
        icon3.src = "{{url_for('static', filename='resources/spotify-icon-black.png')}}";
    } else {
        icon1.src = "{{url_for('static', filename='resources/spotify-icon-black.png')}}";
        icon2.src = "{{url_for('static', filename='resources/spotify-icon-black.png')}}";
        icon3.src = "{{url_for('static', filename='resources/spotify-icon-black.png')}}";
    }

}