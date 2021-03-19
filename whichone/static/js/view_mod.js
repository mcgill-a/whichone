// view_mod.js
function View(input, output) {
  const args = input;

  /* Scores */
  const current_score = args.document.querySelectorAll(".current-score");
  const high_score = args.document.querySelectorAll(".high-score");
  /* Icons */
  const life_icons = args.document.querySelectorAll(".life");
  const mute_icon = args.document.getElementById("mute-icon");
  /* Question */
  const mode_prefix = args.document.getElementById("mode_prefix");
  const mode_text = args.document.getElementById("mode_text");
  const mode_suffix = args.document.getElementById("mode_suffix");
  const next_question = args.document.getElementById("next-question");
  /* Choice */
  const choice_1_text = args.document.getElementById("text1");
  const choice_1_image = args.document.getElementById("image1");
  const choice_2_text = args.document.getElementById("text2");
  const choice_2_image = args.document.getElementById("image2");
  const choices = args.document.querySelectorAll(".choice");
  /* Options */
  const options_popup = args.document.getElementById("options-popup");
  /* Data */
  const data_popup = args.document.getElementById("data-popup");
  /* Timer */
  //const time_up = args.document.querySelectorAll(".time-up");
  const time_display = args.document.getElementById("time-display");
  const down = args.document.getElementById("down");
  const counter = args.document.getElementById("countdown-number");
  /* Stats */
  const stats_popup = args.document.getElementById("stats-popup");
  const stats_status = args.document.getElementById("stats-status");
  /* End game */
  const game_over = args.document.getElementById("game-over");
  const end_score = args.document.getElementById("end_score");
  const end_comment = args.document.getElementById("end_comment");

  const ICONS = {
    LIFE_ENABLED: "/static/resources/spotify-icon.png",
    LIFE_DISABLED: "/static/resources/spotify-icon-dark.png",
    LIFE_CHEATER: "/static/resources/spotify-icon-red.png",
    SOUND_ENABLED: "/static/resources/volume-on.png",
    SOUND_DISABLED: "/static/resources/volume-off.png",
  };

  output.showChoices = function showChoices() {
    sceneChoices();
  };

  output.endGameTransition = function endGameTransition(score, cheaterMode) {
    sceneEndGame(score, cheaterMode);
  };

  output.updateScores = function updateScores(currentScore, highScore) {
    // scores are displayed in multiple places, update them all
    current_score.forEach((score) => {
      score.textContent = currentScore;
    });

    high_score.forEach((score) => {
      score.textContent = highScore;
    });
  };

  output.updateLifeIcons = function updateLifeIcons(lives, cheaterMode) {
    for (let i = 0; i < life_icons.length; i++) {
      if (cheaterMode) {
        life_icons[i].src = ICONS.LIFE_CHEATER;
      } else {
        if (i < lives) {
          life_icons[i].src = ICONS.LIFE_ENABLED;
        } else {
          life_icons[i].src = ICONS.LIFE_DISABLED;
        }
      }
    }
  };

  output.triggerSound = function triggerSound(src) {
    const audio = new Audio(src);
    audio.oncanplay = function () {
      audio.volume = 0.3;
      audio.play();
    };
    audio.onerror = function () {
      console.error(`Audio source not found (${src})`);
    };
  };

  output.updateCounter = function updateCounter(time) {
    counter.textContent = time;
    // TODO: if time < x, set outline border to red
  };

  output.showCounter = function showCounter() {};

  output.hideCounter = function hideCounter() {};

  output.showStats = function showStats(mode, options, choice, lives, answer) {
    if (choice === answer) {
      stats_status.textContent = "Correct!";
      data_popup.classList.add("green-border");
      setTimeout(function () {
        data_popup.classList.remove("green-border");
      }, 1000);

      if (choice === "1") {
        choice_1_text.classList.add("text-correct");
      } else {
        choice_2_text.classList.add("text-correct");
      }
    } else {
      stats_status.textContent = getWrongAnswerText();
      data_popup.classList.add("red-border");
      setTimeout(function () {
        data_popup.classList.remove("red-border");
      }, 1000);

      // if they didn't choose anything and the timer expired
      if (choice === "") {
        choice_1_text.classList.add("text-wrong");
        choice_2_text.classList.add("text-wrong");
      } else if (choice === "1") {
        choice_1_text.classList.add("text-wrong");
      } else if (choice === "2") {
        choice_2_text.classList.add("text-wrong");
      }
    }

    // hide the timer
    down.classList.add("transparent");

    // Transition scenes from the cards to the stats display
    sceneStats(lives);
  };

  output.updateMuteIcon = function updateMuteIcon(enabled) {
    if (enabled) {
      mute_icon.src = ICONS.SOUND_ENABLED;
    } else {
      mute_icon.src = ICONS.SOUND_DISABLED;
    }
  };

  output.updateQuestion = function updateQuestion(mode, options) {
    let prefix = "";
    let text = "";
    let suffix = "?";

    if (mode === "artist_popularity") {
      prefix = "Which artist have you ";
      text = "listened to more";
      mode_text.className = "text-popularity";
    } else if (mode === "track_popularity") {
      prefix = "Which track have you ";
      text = "listened to more";
      mode_text.className = "text-popularity";
    } else if (mode === "danceability") {
      prefix = "Which track is more ";
      text = "danceable";
      mode_text.className = "text-danceable";
    } else if (mode === "valence") {
      prefix = "Which track is more ";
      text = "upbeat";
      mode_text.className = "text-valence";
    } else if (mode === "duration") {
      prefix = "Which track is ";
      text = "longer";
      mode_text.className = "text-duration";
    }

    mode_prefix.textContent = prefix;
    mode_text.textContent = text;
    mode_suffix.textContent = suffix;

    choice_1_text.textContent = options["1"].data.name;
    choice_2_text.textContent = options["2"].data.name;

    if (mode === "artist_popularity") {
      choice_1_image.src = options["1"].data.images[1].url;
      choice_2_image.src = options["2"].data.images[1].url;
    } else {
      choice_1_image.src = options["1"].data.album.images[1].url;
      choice_2_image.src = options["2"].data.album.images[1].url;
    }
  };

  function sceneChoices() {
    // reset the text colour for choices
    choice_1_text.classList.remove("text-wrong", "text-correct");
    choice_2_text.classList.remove("text-wrong", "text-correct");

    /* Hide */
    game_over.classList.add("disabled");
    options_popup.classList.add("disabled");
    stats_popup.classList.add("disabled");
    stats_popup.classList.add("transparent");
    down.classList.add("transparent");

    /* Show */
    time_display.classList.remove("disabled");
    data_popup.classList.remove("disabled");

    choices.forEach((choice) => {
      choice.classList.remove("disabled");
      choice.classList.remove("transparent");
      choice.classList.add("cursor-pointer");
    });
  }

  async function sceneStats(lives, primaryDelay = 1000, secondaryDelay = 125) {
    if (lives <= 0) {
      next_question.innerHTML = "Finish &#10132;&nbsp;";
    } else {
      next_question.innerHTML = "Next question &#10132;&nbsp;";
    }

    // after 1 second, fade out cards
    await new Promise((resolve) => setTimeout(resolve, primaryDelay));
    choices.forEach((choice) => {
      choice.classList.add("transparent");
      choice.classList.remove("cursor-pointer");
    });

    down.classList.add("transparent");
    stats_popup.classList.add("transparent");

    // after cards have faded, display the stats popup
    await new Promise((resolve) => setTimeout(resolve, secondaryDelay));
    choices.forEach((choice) => {
      choice.classList.add("disabled");
    });
    time_display.classList.add("disabled");
    stats_popup.classList.remove("disabled");
    stats_popup.classList.remove("transparent");
  }

  function sceneEndGame(score, cheaterMode) {
    end_score.textContent = "You scored ";
    end_comment.textContent = getGameOverText(score, cheaterMode);
    $("#stats-popup").css("opacity", 0);
    $("#stats-popup").addClass("disabled");
    $(".game-over").removeClass("disabled");
    $(".enable-after-end").removeClass("disabled");
    $(".choice").addClass("disabled");
    $(".time-display").addClass("disabled");
    $("#data-popup").addClass("disabled");
    $("#options-popup").removeClass("disabled");

    if (!$("#game-over-headline").text().endsWith("!")) {
      $("#game-over-headline").append("!");
    }

    $("#game-over-button-text").text("Play Again");
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
      "How did you arrive at your answer?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  function getGameOverText(score, cheaterMode) {
    if (cheaterMode) {
      return `Looks like you triggered cheater mode..`;
    } else if (score == 0) {
      return `Better luck next time!`;
    } else if (score == 1) {
      return `At least that's more than 0!`;
    } else if (score > 1 && score < 6) {
      return `Tip: Choose the correct answers next time`;
    } else if (score >= 6 && score < 12) {
      return `Pretty good attempt! You're starting to get the hang of this`;
    } else if (score >= 12 && score < 20) {
      return `Nice one! `;
    } else if (score >= 20 && score < 100) {
      return `Congrats! You've nailed that one. Can you beat it again?`;
    } else {
      return `Something's wrong I can feel it`;
    }
  }
}
