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

var thisOption1 = "";
var thisOption2 = "";
var thisPop1 = "";
var thisPop2 = "";

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
        artistList = Object.values(user.top_artists)[1];

        // creates 2 reference numbers from available numbers
        listLen = artistList.length;
        num1 = Math.floor(Math.random() * listLen);
        num2 = Math.floor(Math.random() * listLen);

        pop1 = 0;
        pop2 = 0;

        // reference numbers cannot match
        while (num1 == num2 || pop1 == pop2) {

            num2 = Math.floor(Math.random() * listLen);

            // get data for artist at list position num1
            artist1 = artistList[num1];
            artist1Data = Object.values(artist1);
            artist1Name = Object.values(artist1Data)[6];
            artist1Popularity = Object.values(artist1Data)[7];
            pop1 = artist1Popularity;

            thisOption1 = artist1Name;
            thisPop1 = artist1Popularity;

            track1ImageList = Object.values(artist1Data)[5];
            track1ImageData = track1ImageList[1];
            track1Image = track1ImageData.url;

            // get data for artist at list position num2
            artist2 = artistList[num2];
            artist2Data = Object.values(artist2);
            artist2Name = Object.values(artist2Data)[6];
            artist2Popularity = Object.values(artist2Data)[7];
            pop2 = artist2Popularity;

            thisOption2 = artist2Name;
            thisPop2 = artist2Popularity;

            track2ImageList = Object.values(artist2Data)[5];
            track2ImageData = track2ImageList[1];
            track2Image = track2ImageData.url;

        }

        updateMode("artist", " have you listened to more?");

        document.getElementById("text1a").textContent = artist1Name;
        document.getElementById("text2a").textContent = artist2Name;

        let pic1 = document.getElementById("image1");
        pic1.src = track1Image;
        let pic2 = document.getElementById("image2");
        pic2.src = track2Image;

    }
}

function compareTracks() {

    if (user.top_tracks == [] || user.top_tracks == undefined || !user.top_tracks) {
        console.error("No data")
    } else {

        // accesses "items" section of JSON
        // lists all the tracks in the items
        trackList = Object.values(user.top_tracks)[1];

        // creates 2 reference numbers from available numbers
        listLen = trackList.length;
        num1 = Math.floor(Math.random() * listLen);
        num2 = Math.floor(Math.random() * listLen);

        pop1 = 0;
        pop2 = 0;

        // reference numbers cannot match
        while (num1 == num2 || pop1 == pop2) {

            num2 = Math.floor(Math.random() * listLen);

            track1 = trackList[num1];
            track1Data = Object.values(track1);
            track1Name = Object.values(track1Data)[11];
            track1Popularity = Object.values(track1Data)[12];
            pop1 = track1Popularity;
            track1ID = Object.values(track1Data)[9];

            thisOption1 = track1Name;
            thisPop1 = track1Popularity;

            track1AlbumRef = Object.values(track1Data)[0];
            track1ImageList = Object.values(track1AlbumRef)[6];
            track1ImageData = track1ImageList[1];
            track1Image = track1ImageData.url;
            track1Dance = 0;

            track2 = trackList[num2];
            track2Data = Object.values(track2);
            track2Name = Object.values(track2Data)[11];
            track2Popularity = Object.values(track2Data)[12];
            pop2 = track2Popularity;
            track2ID = Object.values(track2Data)[9];

            thisOption2 = track2Name;
            thisPop2 = track2Popularity;

            track2AlbumRef = Object.values(track2Data)[0];
            track2ImageList = Object.values(track2AlbumRef)[6];
            track2ImageData = track2ImageList[1];
            track2Image = track2ImageData.url;
            track2Dance = 0;

        }

        updateMode("track", " have you listened to more?");

        document.getElementById("text1a").textContent = track1Name;
        document.getElementById("text2a").textContent = track2Name;

        let pic1 = document.getElementById("image1");
        pic1.src = track1Image;
        let pic2 = document.getElementById("image2");
        pic2.src = track2Image;

    }
}

function makeGuess(option) {

    if (option == null || thisOption1 == null || thisOption2 == null) {
        console.log("There is a problem, an option is null");

    } else if (option == '1') {
        if (thisPop1 > thisPop2) {
            //correct answer
            userCurrentScore += 1;
            updateLives();
            document.getElementById("current_score").textContent = userCurrentScore;
        } else if (thisPop2 > thisPop1) {
            // wrong answer
            lives -= 1;
            console.log("wrong -1 life, lives = " + lives);
            updateLives();
            if (lives == 0){
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
        if (thisPop2 > thisPop1) {
            //correct answer
            userCurrentScore += 1;
            updateLives();
            document.getElementById("current_score").textContent = userCurrentScore;
        } else if (thisPop1 > thisPop2) {
            // wrong answer
            lives -= 1;
            updateLives();
            console.log("wrong -1 life, lives = " + lives);
            if (lives == 0){
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
        icon1.src="{{url_for('static', filename='resources/spotify-icon.png')}}";
        icon2.src="{{url_for('static', filename='resources/spotify-icon.png')}}";
        icon3.src="{{url_for('static', filename='resources/spotify-icon.png')}}";
    }

    else if (lives == 2) {
        icon1.src="{{url_for('static', filename='resources/spotify-icon.png')}}";
        icon2.src="{{url_for('static', filename='resources/spotify-icon.png')}}";
        icon3.src="{{url_for('static', filename='resources/spotify-icon-black.png')}}";
    }

    else if (lives == 1) {
        icon1.src="{{url_for('static', filename='resources/spotify-icon.png')}}";
        icon2.src="{{url_for('static', filename='resources/spotify-icon-black.png')}}";
        icon3.src="{{url_for('static', filename='resources/spotify-icon-black.png')}}";
    }

    else {
        icon1.src="{{url_for('static', filename='resources/spotify-icon-black.png')}}";
        icon2.src="{{url_for('static', filename='resources/spotify-icon-black.png')}}";
        icon3.src="{{url_for('static', filename='resources/spotify-icon-black.png')}}";
    }

}