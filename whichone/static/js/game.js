function stopGame() {
    stopped = true;
    user["scores"].push(userCurrentScore);
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
    paused = false;
    randomMode();
    showChoices();
    lives = 3;
    updateLives();
    $(".choice").css("opacity", 1);
    $(".choice").css("cursor", "pointer");
    $(".down").css("opacity", 1);
    $(".time-up").css("opacity", 0);
    $(".time-up").css("display", "none");
    startCounter();
}

function calculateScoreData(array) {
    let total = 0;
    let min = null;
    let max = null;
    array.forEach(value => {
        total += value;
        
        if (min == null|| value < min) {
            min = value;
        }

        if (max == null || value > max) {
            max = value;
        }
    });

    let mean = total / array.length;

    return {
        scores: user.scores,
        min: min,
        max: max,
        mean: mean,
    };
}

function getScoreData() {
    let data = calculateScoreData(user.scores)
    data.stdev = getStandardDeviation(data.scores, data.mean);
    return data;
}

function getStandardDeviation (array, mean) {
    const n = array.length;
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

function wrongAnswer(temporarilyHideCards=false) {
    lives -= 1;
    updateLives();
    
    let hideDelay = 0;
    
    if (temporarilyHideCards) {
        hideDelay = 2000; // delay in ms
        let opacityDelay = 125;
        $(".choice").css("opacity", 0);
        $(".choice").css("cursor", "default");
        $(".down").css("opacity", 0);
        $(".down").css("display", "none");
        paused = true;

        setTimeout(function() {
            $(".time-up").css("display", "flex");
            $(".time-up").css("opacity", 1);
        }, opacityDelay);

        setTimeout(function() {
            $(".time-up").css("display", "flex");
            $(".time-up").css("opacity", 1);
        }, hideDelay-opacityDelay);
    }

    setTimeout(function(){
        $(".time-up").css("display", "none");
        $(".time-up").css("opacity", 0);
        if (option1 != null && option2 != null) {
            getStats(option1[currentMode], option2[currentMode]);
            $("#stats-popup").removeClass("hidden");
        }
        if (lives <= 0) {
            stopGame();
            stopCounter();
        } else {
            randomMode();
            resetCounter();
            paused = false;
            $(".choice").css("opacity", 1);
            $(".choice").css("cursor", "pointer");
            $(".down").css("display", "flex");
            $(".down").css("opacity", 1);
        }
    }, hideDelay);
    
}

function correctAnswer() {
    userCurrentScore += 1;
    updateLives();
    document.getElementById("current_score").textContent = userCurrentScore;
    if (option1 != null && option2 != null) {
        getStats(option1[currentMode], option2[currentMode]);
        $("#stats-popup").removeClass("hidden");
    }

    if (!stopped) {
        randomMode();
        resetCounter();
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
                correctAnswer();
        } else {
            wrongAnswer();
        }
    }
}


function compareArtists() {
    if (user.top_artists == [] || user.top_artists == undefined || !user.top_artists) {
        console.error("No data")
    } else {
        artistList = user.top_artists;
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
        trackList = user.top_tracks;
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
            if (user['audio_features'] == null) {
                currentMode = "popularity";
            } else {
                option1['danceability'] = user['audio_features'][option1['id']]['danceability'];
                option1['valence'] = user['audio_features'][option1['id']]['valence'];
                option1['duration'] = user['audio_features'][option1['id']]['duration_ms'];

                option2['danceability'] = user['audio_features'][option2['id']]['danceability'];
                option2['valence'] = user['audio_features'][option2['id']]['valence'];
                option2['duration'] = user['audio_features'][option2['id']]['duration_ms'];
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
        user.high_score = 0;
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