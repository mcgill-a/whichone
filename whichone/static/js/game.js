function stopGame() {
    stopped = true;
    user["scores"].push(userCurrentScore);
    updateHighScore(userCurrentScore);
    updateMode("", "");

    updateLives();
    lives = maxLives;
    document.getElementById("current_score").textContent = userCurrentScore;
    document.getElementById("final_score").textContent = getGameOverText();
    userCurrentScore = 0;
    hideChoices();
    $(".game-over").removeClass("disabled");
    $(".choice").addClass("disabled");
    $(".time-display").addClass("disabled");
}

function getGameOverText() {
    if (cheaterMode) {
        return `why you cheating though?`; 
    } else if (userCurrentScore == 0) {
        return `yikes... you didn't get any right :(`
    } else if (userCurrentScore == 1) {
        return `at least you got one right I guess`
    } else if (userCurrentScore > 1 && userCurrentScore < 6) {
        return `you guessed the right answer ${userCurrentScore} times`; 
    } else if (userCurrentScore >= 6 && userCurrentScore < 12) {
        return `finally... you got ${userCurrentScore} right!`; 
    } else if (userCurrentScore >= 12 && userCurrentScore < 100) {
        return `okay you win, you chose the right one ${userCurrentScore} times`; 
    } else {
        return `you got ${userCurrentScore} right :)`; 
    }
}

function startGame() {    
    $(".game-over").addClass("disabled");
    $(".time-up").addClass("disabled");
    $(".time-display").removeClass("disabled");
    $(".choice").removeClass("disabled");
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
        paused = true;

        setTimeout(function() {
            $(".choice").addClass("disabled");
            $(".time-up").removeClass("disabled");
            $(".time-up").css("opacity", 1);
        }, opacityDelay);

        setTimeout(function() {
            $(".time-up").css("opacity", 0);
        }, hideDelay-opacityDelay);
    }

    setTimeout(function(){
        $(".choice").removeClass("disabled");
        $(".time-up").addClass("disabled");
        if (option1 != null && option2 != null) {
            getStats(option1[currentMode], option2[currentMode]);
            $("#stats-popup").removeClass("disabled");
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
        $("#stats-popup").removeClass("disabled");
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

        oldNum1 = numTracks[document.getElementById("text1a").textContent];
        oldNum2 = numTracks[document.getElementById("text2a").textContent];

        console.log(oldNum1, oldNum2);

        num1 = Math.floor(Math.random() * numTracks);

        while (num1 == oldNum1 || num1 == oldNum2) {
            num1 = Math.floor(Math.random() * numTracks);
        }

        option1 = null;
        option2 = null;

        // reference numbers cannot match, option cannot match previous option
        while (option1 == null || option2 == null || num1 == num2 || num2 == oldNum2 || num2 == oldNum1 ||
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
    ps = userCurrentScore;
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
    
    if (Number.isNaN(lives) || lives > 3 || userCurrentScore - ps > 1) {
        cheaterMode = true;
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