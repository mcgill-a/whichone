function cdwn() {
    countdown -= 1;
    if (countdown <= 0 && !paused) {
        wrongAnswer(true);
    }
    countdownNumberEl.textContent = countdown;
}

function startCounter() {
    $("#countdown-number").css("display", "block");
    $("#inner-circle").css("display", "block");
    countdown = 10;
    countdownNumberEl.textContent = countdown;
    if (refreshIntervalId != null) {
        clearInterval(refreshIntervalId);
    }
    refreshIntervalId = setInterval(cdwn, 1000);
    $("#inner-circle").addClass("animated");
}

function resetCounter() {
    $("#inner-circle").css("display", "none");
    countdown = 10;
    countdownNumberEl.textContent = countdown;
    clearInterval(refreshIntervalId);
    refreshIntervalId = setInterval(cdwn, 1000);
    // add a delay so that the animation actually resets
    setTimeout(function(){
        $("#inner-circle").css("display", "block");
    }, 20);
}

function stopCounter() {
    clearInterval(refreshIntervalId);
    $("#inner-circle").css("display", "none");
    $("#countdown-number").css("display", "none");
}


function showChoices(scale = false) {
    $('.end-game').addClass("hidden");
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
    $('.end-game').removeClass("hidden");
}


function updateMode(mode_intro, mode_text) {
    document.getElementById("mode_intro").textContent = mode_intro;
    document.getElementById("mode_text").textContent = mode_text;

    document.getElementById("mode_intro").style.color = "whitesmoke";
    document.getElementById("question_mark").textContent = "?";

    if (mode_intro == "") {
        document.getElementById("mode_intro").style.color = "#FF0000";
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
    if (score > user.high_score && !cheaterMode) {
        user.high_score = score;
    }
    localStorage.setItem("user", JSON.stringify(user));
    document.getElementById("high_score").textContent = user.high_score;
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
        timesMore = "1.1x";
    }
    else {
        timesMore = timesMore + "x";
    }

    amountMore = Math.round((big - small) * 10) / 10;

    durationMore = amountMore / 1000;
    durationMore = Math.round(durationMore);

    plural = "s";

    if (currentMode == 'danceability') {
        document.getElementById("stats-text").textContent = bigChoice + " is " + timesMore + " more danceable than " + smallChoice + ".";
    } else if (currentMode == 'valence') {
        document.getElementById("stats-text").textContent = bigChoice + " is " + timesMore + " more upbeat than " + smallChoice + ".";
    } else if (currentMode == 'duration') {
        if (durationMore == 1) {
            plural = "";
        }
        document.getElementById("stats-text").textContent = bigChoice + " is " + durationMore + " second" + plural + " longer than " + smallChoice + ".";
    } else if (currentMode == 'popularity') {
        document.getElementById("stats-text").textContent = "You have listened to " + bigChoice + " " + timesMore + " more than " + smallChoice + ".";
    }
}