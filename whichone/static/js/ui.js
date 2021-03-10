function cdwn() {
  countdown -= 1;
  if (countdown > 0 && countdown <= 6 && !paused && !stopped) {
    $("#inner-circle").css("stroke", "rgb(239,83,80)");
  } else {
    $("#inner-circle").css("stroke", "rgb(255,199,137)");
  }
  if (countdown == 0 && !paused) {
    wrongAnswer(null);
  }
  countdownNumberElement.textContent = countdown;
}

function startCounter() {
  $("#countdown-number").css("display", "block");
  $("#inner-circle").css("display", "block");
  countdown = DEFAULT_COUNTDOWN_VALUE;
  countdownNumberElement.textContent = countdown;
  if (refreshIntervalId != null) {
    clearInterval(refreshIntervalId);
  }
  refreshIntervalId = setInterval(cdwn, 1000);
  $("#inner-circle").addClass("animated");
}

function resetCounter() {
  $("#inner-circle").css("display", "none");
  countdown = DEFAULT_COUNTDOWN_VALUE;
  countdownNumberElement.textContent = countdown;
  clearInterval(refreshIntervalId);
  refreshIntervalId = setInterval(cdwn, 1000);
  // add a delay so that the animation actually resets
  setTimeout(function () {
    $("#inner-circle").css("display", "block");
  }, 20);
}

function stopCounter() {
  clearInterval(refreshIntervalId);
  $("#inner-circle").css("display", "none");
  $("#countdown-number").css("display", "none");
}

function showChoices() {
  $(".end-game").addClass("hidden");
  $(".choice").removeClass("slow-transition");
  $(".choice").addClass("fast-transition");
  $(".choice").css("cursor", "pointer");
  $(".choice").css("opacity", "1");
}

function hideChoices(scale = false) {
  $(".choice").removeClass("fast-transition");
  $(".choice").addClass("slow-transition");
  $(".choice").css("cursor", "default");
  if (scale) {
    $(".choice").css("transform", "scale(0)");
  } else {
    $(".choice").css("opacity", "0");
  }
  $(".end-game").removeClass("hidden");
}

function showEndGameUI() {
  document.getElementById("end_score").textContent = "You scored ";
  document.getElementById("end_score_value").textContent = userCurrentScore;
  document.getElementById("end_comment").textContent = getGameOverText();

  $(".game-over").removeClass("disabled");
  $(".enable-after-end").removeClass("disabled");
  $(".choice").addClass("disabled");
  $(".time-display").addClass("disabled");
  $("#data-popup").addClass("disabled");
  $("#options-popup").removeClass("disabled");
  $("#game-over-headline").append("!");
  $("#game-over-button-text").text("Play Again");
}

function getGameOverText() {
  if (cheaterMode) {
    return `Looks like you enabled cheater mode..`;
  } else if (userCurrentScore == 0) {
    return `Better luck next time!`;
  } else if (userCurrentScore == 1) {
    return `At least that's more than 0!`;
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

function wrongAnswerUI(option) {
  $(".choice").css("cursor", "default");
  $("#stat-status").text(getWrongAnswerText());

  if (lives <= 0) {
    $("#stat-next").text("Finish");
    $("#stat-next").append(" &#10132;");
  }

  $("#data-popup").addClass("red-border");
  setTimeout(function () {
    $("#data-popup").removeClass("red-border");
  }, 800);

  // hide the timer
  $(".down").css("opacity", 0);

  // change text colour of the card they chose to red + append an X symbol
  if (option == "1") {
    $("#text1a").css("color", "red");
    $("#text1a").append(" &#10008;");
  } else if (option == "2") {
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
  }, 500);
}

function correctAnswerUI(option) {
  $(".choice").css("cursor", "default");
  $("#stat-status").text("Correct!");
  $("#data-popup").addClass("green-border");
  setTimeout(function () {
    $("#data-popup").removeClass("green-border");
  }, 800);

  // hide the timer
  $(".down").css("opacity", 0);

  // change text colour of the card they chose to green
  if (option == "1") {
    $("#text1a").css("color", "lightgreen");
    $("#text1a").append(" &#10004;");
  } else if (option == "2") {
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
    }, opacityDelay);
  }, 500);
}

function updateMode(mode_intro, mode_text) {
  document.getElementById("mode_intro").textContent = mode_intro;
  document.getElementById("mode_text").textContent = mode_text;

  document.getElementById("mode_intro").style.color = "whitesmoke";
  document.getElementById("question_mark").textContent = "?";
  document.getElementById("question_mark").style.color = "whitesmoke";

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
  localStorage.setItem(spotify_id, JSON.stringify(user));
  document.getElementById("high_score-m").textContent = user.high_score;
  document.getElementById("high_score-d").textContent = user.high_score;
  document.getElementById("end_high_score").textContent =
    "High score: " + user.high_score;
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

  let usePercent = false;

  timesMore = Math.round((big / small) * 10) / 10;
  if (timesMore == Infinity) {
    timesMore = "a lot";
  } else if (timesMore < 2) {
    usePercent = true;
  } else {
    timesMore = timesMore + "x";
  }

  percentMore = Math.round((small / big) * 100) + "%";
  if (percentMore == "0%") {
    percentMore = "1%";
  }

  amountMore = Math.round((big - small) * 10) / 10;

  durationMore = amountMore / 1000;
  durationMore = Math.round(durationMore);

  plural = "s";

  if (currentMode == "danceability") {
    document.getElementById(
      "stats-text"
    ).textContent = `${bigChoice} is ${percentMore} more danceable than ${smallChoice}.`;
  } else if (currentMode == "valence") {
    document.getElementById(
      "stats-text"
    ).textContent = `${bigChoice} is ${percentMore} more upbeat than ${smallChoice}.`;
  } else if (currentMode == "duration") {
    if (durationMore == 1) {
      plural = "";
    }
    document.getElementById(
      "stats-text"
    ).textContent = `${bigChoice} is ${durationMore} second${plural} longer than ${smallChoice}.`;
  } else if (currentMode == "popularity") {
    if (usePercent) {
      document.getElementById(
        "stats-text"
      ).textContent = `You have listened to ${bigChoice} ${percentMore} more than ${smallChoice}.`;
    } else {
      document.getElementById(
        "stats-text"
      ).textContent = `You have listened to ${bigChoice} ${timesMore} more than ${smallChoice}.`;
    }
  }
}

function setMuteIcon() {
  if (user.muteSound) {
    document.getElementById("mute-icon").src =
      "/static/resources/volume-off.png";
  } else {
    document.getElementById("mute-icon").src =
      "/static/resources/volume-on.png";
  }
  localStorage.setItem(spotify_id, JSON.stringify(user));
}
