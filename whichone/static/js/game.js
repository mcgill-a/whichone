function stopGame() {
    stopped = true;
    console.log("Game over. Final score: " + userCurrentScore);
    updateHighScore(userCurrentScore);
    updateMode("", "");

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

function randomMode() {

    let choiceArray = ["popularity", "popularity"];

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