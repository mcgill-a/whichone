function stopGame() {
    stopped = true;

    if (!user.muteSound) {
        var audio = new Audio("/static/resources/gameover.mp3");
        audio.volume = 0.3;
        audio.play();
    }

    user["scores"].push(userCurrentScore);

    updateHighScore(userCurrentScore);
    updateMode("", "");

    updateLives();
    lives = maxLives;
    document.getElementById("end_score").textContent = "You scored ";
    document.getElementById("end_score_value").textContent = userCurrentScore;
    document.getElementById("end_comment").textContent = getGameOverText();
    userCurrentScore = 0;
    hideChoices();
    $(".game-over").removeClass("disabled");
    $(".choice").addClass("disabled");
    $(".time-display").addClass("disabled");
    $("#data-popup").addClass("disabled");
    $("#options-popup").removeClass("disabled");
}

function getGameOverText() {
    if (cheaterMode) {
        return `Looks like you enabled cheater mode..`;
    } else if (userCurrentScore == 0) {
        return `Better luck next time!`
    } else if (userCurrentScore == 1) {
        return `At least that's more than 0!`
    } else if (userCurrentScore > 1 && userCurrentScore < 6) {
        return `Tip: Choose the correct answers next time`;
    } else if (userCurrentScore >= 6 && userCurrentScore < 12) {
        return `Pretty good attempt! You're starting to get the hang of this`;
    } else if (userCurrentScore >= 12 && userCurrentScore < 20) {
        return `Nice one! `;
    } else if (userCurrentScore >= 20 && userCurrentScore < 100) {
        return `Congrats! You've nailed that one. Can you beat it again?`;
    } else {
        return `Something's wrong I can feel it`;
    }
}

function startGame() {
    $(".game-over").addClass("disabled");
    $(".time-up").addClass("disabled");
    $(".time-display").removeClass("disabled");
    $(".choice").removeClass("disabled");
    $("#data-popup").removeClass("disabled");
    $("#options-popup").addClass("disabled");
    $("#stat-next").text("Next question");
    $("#stat-next").append(" &#10132;");
    document.getElementById("current_score-m").textContent = userCurrentScore;
    document.getElementById("current_score-d").textContent = userCurrentScore;
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

        if (min == null || value < min) {
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
    let data = calculateScoreData(user.scores);
    data.stdev = getStandardDeviation(data.scores, data.mean);
    return data;
}

function getStandardDeviation(array, mean) {
    const n = array.length;
    return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}


// this will be run in an onclick when they select next question
function nextScreen() {
    // hide the stats popup
    $("#stats-popup").css("opacity", 0);
    $("#stats-popup").addClass("disabled");
    $("#text1a").css("color", "whitesmoke");
    $("#text2a").css("color", "whitesmoke");

    if (lives <= 0) {
        stopGame();
        stopCounter();
    } else {
        // show the cards + timer
        $(".choice").removeClass("disabled");
        $(".down").css("opacity", 1);
        $(".time-display").removeClass("disabled");
        randomMode();
        resetCounter();
        paused = false;
        $(".choice").css("cursor", "pointer");
    }
}

function getWrongAnswerText() {
    let responses = [
        "Not quite...",
        "Swing and a miss, incorrect.",
        "Close but no banana.",
        "Unfortunately not...",
        "Better luck next time!",
        "Thanks for trying, but no.",
        "I can see why you might've thought that.",
        "Did you accidentally choose the wrong one?",
        "You’re on the right track, but not there yet.",
        "Not exactly what we were looking for.",
        "How did you arrive at your answer?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

function wrongAnswer(option) {
    if (!paused) {
        paused = true;
        $(".choice").css("cursor", "default");
        $("#stat-status").text(getWrongAnswerText());

        if (!user.muteSound) {
            var audio = new Audio("/static/resources/wrong.mp3");
            audio.volume = 0.3;
            audio.play();
        }

        // update the player lives
        lives -= 1;
        updateLives();

        if (lives <= 0) {
            $("#stat-next").text("Finish");
            $("#stat-next").append(" &#10132;");
        }

        // get the statistics for this round
        if (option1 != null && option2 != null) {
            getStats(option1[currentMode], option2[currentMode]);
        }

        // hide the timer
        $(".down").css("opacity", 0);

        // change text colour of the card they chose to red + append an X symbol
        if (option == '1') {
            $("#text1a").css("color", "red");
            $("#text1a").append(" &#10008;");
        } else if (option == '2') {
            $("#text2a").css("color", "red");
            $("#text2a").append(" &#10008;");
        } else {
            // they didn't choose either (time ran out), mark both wrong
            $("#text1a").css("color", "red");
            $("#text1a").append(" &#10008;");
            $("#text2a").css("color", "red");
            $("#text2a").append(" &#10008;");
        }

        // after 1 second, fade out cards
        setTimeout(function () {
            let opacityDelay = 125;
            $(".choice").css("opacity", 0);
            $(".choice").css("cursor", "default");
            $(".down").css("opacity", 0);
            $("#stats-popup").css("opacity", 0);

            // after cards have faded, display the stats popup
            setTimeout(function () {
                $(".choice").addClass("disabled");
                $(".time-display").addClass("disabled");
                $("#stats-popup").removeClass("disabled");
                $("#stats-popup").css("opacity", 1);
            }, opacityDelay);
        }, 1000);
    }
}

function correctAnswer(option) {
    if (!paused) {
        paused = true;
        $(".choice").css("cursor", "default");
        $("#stat-status").text("Correct!");

        if (!user.muteSound) {
            var audio = new Audio("/static/resources/correct.mp3");
            audio.volume = 0.3;
            audio.play();
        }

        userCurrentScore += 1;
        updateLives();
        document.getElementById("current_score-m").textContent = userCurrentScore;
        document.getElementById("current_score-d").textContent = userCurrentScore;

        // get the statistics for this round
        if (option1 != null && option2 != null) {
            getStats(option1[currentMode], option2[currentMode]);
        }

        // hide the timer
        $(".down").css("opacity", 0);

        // change text colour of the card they chose to green
        if (option == '1') {
            $("#text1a").css("color", "lightgreen");
            $("#text1a").append(" &#10004;");
        } else if (option == '2') {
            $("#text2a").css("color", "lightgreen");
            $("#text2a").append(" &#10004;");
        }

        // after 1 second, fade out cards
        setTimeout(function () {
            hideDelay = 2000; // delay in ms
            let opacityDelay = 125;
            $(".choice").css("opacity", 0);
            $(".choice").css("cursor", "default");
            $(".down").css("opacity", 0);
            $("#stats-popup").css("opacity", 0);

            // after cards have faded, display the stats popup
            setTimeout(function () {
                $(".choice").addClass("disabled");
                $(".time-display").addClass("disabled");
                $("#stats-popup").removeClass("disabled");
                $("#stats-popup").css("opacity", 1);
            }, opacityDelay)
        }, 1400);
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
            correctAnswer(option);
        } else {
            wrongAnswer(option);
        }
    }
}

function compareArtists() {
    if (
        user.top_artists == [] ||
        user.top_artists == undefined ||
        !user.top_artists
    ) {
        console.error("No data");
    } else {
        artistList = user.top_artists;
        numTracks = artistList.length;

        oldNum1 = numTracks[document.getElementById("text1a").textContent];
        oldNum2 = numTracks[document.getElementById("text2a").textContent];

        num1 = Math.floor(Math.random() * numTracks);

        while (num1 == oldNum1 || num1 == oldNum2) {
            num1 = Math.floor(Math.random() * numTracks);
        }

        option1 = null;
        option2 = null;

        // reference numbers cannot match, option cannot match previous option
        while (
            option1 == null ||
            option2 == null ||
            num1 == num2 ||
            num2 == oldNum2 ||
            num2 == oldNum1 ||
            option1[currentMode] == option2[currentMode]
        ) {
            // switch the index for option2
            num2 = Math.floor(Math.random() * numTracks);

            option1 = artistList[num1];
            option2 = artistList[num2];
        }

        updateMode("Which artist have you ", "listened to more");

        document.getElementById("text1a").textContent = option1["name"];
        document.getElementById("text2a").textContent = option2["name"];

        document.getElementById("image1").src = option1["images"][1]["url"];
        document.getElementById("image2").src = option2["images"][1]["url"];
        $(".choice").css("opacity", "1");
    }
}

function compareTracks() {
    if (
        user.top_tracks == [] ||
        user.top_tracks == undefined ||
        !user.top_tracks
    ) {
        console.error("No data");
    } else {
        trackList = user.top_tracks;
        numTracks = trackList.length;
        num1 = Math.floor(Math.random() * numTracks);

        option1 = null;
        option2 = null;

        // reference numbers cannot match
        while (
            option1 == null ||
            option2 == null ||
            option1[currentMode] == option2[currentMode] ||
            option1["name"] == option2["name"]
        ) {
            // switch the index for option2
            num2 = Math.floor(Math.random() * numTracks);

            option1 = trackList[num1];
            option2 = trackList[num2];

            // if features dict hasn't been initialised yet, just use popularity
            if (user["audio_features"] == null) {
                currentMode = "popularity";
            } else {
                option1["danceability"] =
                    user["audio_features"][option1["id"]]["danceability"];
                option1["valence"] = user["audio_features"][option1["id"]]["valence"];
                option1["duration"] =
                    user["audio_features"][option1["id"]]["duration_ms"];

                option2["danceability"] =
                    user["audio_features"][option2["id"]]["danceability"];
                option2["valence"] = user["audio_features"][option2["id"]]["valence"];
                option2["duration"] =
                    user["audio_features"][option2["id"]]["duration_ms"];
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

        document.getElementById("text1a").textContent = option1["name"];
        document.getElementById("text2a").textContent = option2["name"];

        document.getElementById("image1").src =
            option1["album"]["images"][1]["url"];
        document.getElementById("image2").src =
            option2["album"]["images"][1]["url"];
        $(".choice").css("opacity", "1");
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
    } else {
        // currentMode == "valence"
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