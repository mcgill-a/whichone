function View(document, view) {
  const ICONS = {
    LIFE_ENABLED: "/static/resources/spotify-icon.png",
    LIFE_DISABLED: "/static/resources/spotify-icon-dark.png",
    LIFE_CHEATER: "/static/resources/spotify-icon-red.png",
    SOUND_ENABLED: "/static/resources/volume-on.png",
    SOUND_DISABLED: "/static/resources/volume-off.png",
  };

  /* Scores */
  const current_score = document.querySelectorAll(".current-score");
  const high_score = document.querySelectorAll(".high-score");
  /* Icons */
  const life_icons = document.querySelectorAll(".life");
  const mute_icon = document.getElementById("mute-icon");
  /* Toggles */
  const toggle_danceability = document.getElementById("danceability");
  const toggle_valence = document.getElementById("valence");
  const toggle_duration = document.getElementById("duration_ms");
  /* Question */
  const mode_prefix = document.getElementById("mode_prefix");
  const mode_text = document.getElementById("mode_text");
  const mode_suffix = document.getElementById("mode_suffix");
  const next_question = document.getElementById("next-question");
  /* Choice */
  const choice_1_text = document.getElementById("text1");
  const choice_1_image = document.getElementById("image1");
  const choice_2_text = document.getElementById("text2");
  const choice_2_image = document.getElementById("image2");
  const choices = document.querySelectorAll(".choice");
  /* Options */
  const options_popup = document.getElementById("options-popup");
  /* Data */
  const data_popup = document.getElementById("data-popup");
  /* Timer */
  const time_display = document.getElementById("time-display");
  const down = document.getElementById("down");
  const counter = document.getElementById("countdown-number");
  const counter_progress = document.getElementById("inner-circle");
  /* Stats */
  const stats_popup = document.getElementById("stats-popup");
  const stats_status = document.getElementById("stats-status");
  const statistic = document.getElementById("stats-text");
  /* End game */
  const game_over = document.getElementById("game-over");
  const game_over_headline = document.getElementById("game-over-headline");
  const game_over_button_txt = document.getElementById("game-over-button-text");
  const end_score = document.getElementById("end_score");
  const end_score_value = document.getElementById("end_score_value");
  const end_comment = document.getElementById("end_comment");
  const enabled_after_end = document.querySelectorAll(".enable-after-end");

  view.showChoices = function showChoices() {
    sceneChoices();
  };

  view.endGameTransition = function endGameTransition(score, cheaterMode) {
    sceneEndGame(score, cheaterMode);
  };

  view.updateScores = function updateScores(currentScore, highScore) {
    // scores are displayed in multiple places, update them all
    current_score.forEach((score) => {
      score.textContent = currentScore;
    });

    high_score.forEach((score) => {
      if (score.id === "end_high_score") {
        score.textContent = "High score: " + highScore;
      } else {
        score.textContent = highScore;
      }
    });
  };

  view.updateModeToggles = function updateModeToggles(toggles) {
    toggle_danceability.checked = toggles.danceability;
    toggle_valence.checked = toggles.valence;
    toggle_duration.checked = toggles.duration_ms;
  };

  view.updateLifeIcons = function updateLifeIcons(lives, cheaterMode) {
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

  view.updateCountdown = function updateCountdown(maxTime, time) {
    counter.textContent = time;
    if (time <= maxTime / 2) {
      counter_progress.classList.add("stroke-red");
    } else {
      counter_progress.classList.remove("stroke-red");
    }
  };

  view.toggleCountdownAnimation = function toggleCountdownAnimation(
    enabled,
    visibleAfter
  ) {
    if (enabled) {
      counter_progress.classList.add("animated");
      counter_progress.classList.remove("transparent");
      counter.classList.remove("transparent");
    } else {
      counter_progress.classList.remove("animated");
      if (!visibleAfter) {
        counter_progress.classList.add("transparent");
        counter.classList.add("transparent");
      }
    }
  };

  view.showCountdown = function showCountdown() {
    down.classList.remove("no-display");
  };

  view.hideCountdown = function hideCountdown() {
    down.classList.add("no-display");
  };

  view.showStats = function showStats(mode, options, choice, lives, answer) {
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

      if (choice === "1") {
        choice_1_text.classList.add("text-wrong");
      } else if (choice === "2") {
        choice_2_text.classList.add("text-wrong");
      } else {
        choice_1_text.classList.add("text-wrong");
        choice_2_text.classList.add("text-wrong");
      }
    }

    // hide the timer
    down.classList.add("transparent");

    const stat = getStatistic(mode, options, choice, lives, answer);

    // Transition scenes from the cards to the stats display
    sceneStats(lives, stat);
  };

  view.updateMuteIcon = function updateMuteIcon(enabled) {
    if (enabled) {
      mute_icon.src = ICONS.SOUND_ENABLED;
    } else {
      mute_icon.src = ICONS.SOUND_DISABLED;
    }
  };

  view.updateQuestion = function updateQuestion(mode, options) {
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
    } else if (mode === "duration_ms") {
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

  function clearQuestion() {
    mode_prefix.textContent = "";
    mode_text.textContent = "";
    mode_suffix.textContent = "";
  }

  function sceneChoices() {
    // reset the text colour for choices
    choice_1_text.classList.remove("text-wrong", "text-correct");
    choice_2_text.classList.remove("text-wrong", "text-correct");

    /* Hide */
    game_over.classList.add("no-display");
    options_popup.classList.add("no-display");
    stats_popup.classList.add("no-display");
    stats_popup.classList.add("transparent");
    down.classList.add("transparent");

    /* Show */
    time_display.classList.remove("no-display");
    data_popup.classList.remove("no-display");

    choices.forEach((choice) => {
      choice.classList.remove("no-display");
      choice.classList.remove("transparent");
      choice.disabled = false;
    });
  }

  async function sceneStats(
    lives,
    stat,
    primaryDelay = 1000,
    secondaryDelay = 125
  ) {
    if (lives <= 0) {
      next_question.innerHTML = "Finish &#10132;&nbsp;";
    } else {
      next_question.innerHTML = "Next question &#10132;&nbsp;";
    }

    choices.forEach((choice) => {
      choice.disabled = true;
    });

    statistic.textContent = stat;

    // after 1 second, fade out cards
    await new Promise((resolve) => setTimeout(resolve, primaryDelay));
    choices.forEach((choice) => {
      choice.classList.add("transparent");
    });

    down.classList.add("transparent");
    stats_popup.classList.add("transparent");

    // after cards have faded, display the stats popup
    await new Promise((resolve) => setTimeout(resolve, secondaryDelay));
    choices.forEach((choice) => {
      choice.classList.add("no-display");
    });
    time_display.classList.add("no-display");
    stats_popup.classList.remove("no-display");
    stats_popup.classList.remove("transparent");
  }

  function sceneEndGame(score, cheaterMode) {
    clearQuestion();
    end_score.textContent = "You scored ";
    end_score_value.textContent = score;
    end_comment.textContent = getGameOverText(score, cheaterMode);
    stats_popup.classList.add("no-display");
    stats_popup.classList.add("transparent");
    game_over.classList.remove("no-display");

    enabled_after_end.forEach((item) => {
      item.classList.remove("no-display");
    });

    data_popup.classList.add("no-display");
    options_popup.classList.remove("no-display");

    game_over_button_txt.textContent = "Play Again";
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
      return `Looks like you triggered cheater mode...`;
    } else if (score == 0) {
      return `Better luck next time!`;
    } else if (score == 1) {
      return `At least that's more than 0!`;
    } else if (score > 1 && score < 6) {
      return `Tip: Choose the correct answers next time.`;
    } else if (score >= 6 && score < 10) {
      return `Pretty good! You're starting to get the hang of this.`;
    } else if (score >= 10 && score < 20) {
      return `Nice one! `;
    } else if (score >= 20 && score < 100) {
      return `Congrats! You've nailed that one. Can you beat it again?`;
    } else {
      return `Something's wrong I can feel it.`;
    }
  }

  function getStatistic(mode, options, choice, lives, answer) {
    mode =
      mode == "track_popularity" || mode == "artist_popularity"
        ? "popularity"
        : mode;
    small = options[answer] === options["1"] ? options["2"] : options["1"];
    big = options[answer];
    let modeText = "";

    switch (mode) {
      case "popularity":
        bigNum = options[answer].data[mode];
        smallNum = small.data[mode];
        break;
      default:
        bigNum = options[answer].features[mode];
        smallNum = small.features[mode];
        break;
    }
    durationMore = Math.round(Math.round((bigNum - smallNum) * 10) / 10 / 1000);
    amountMore = Math.max(1, Math.round((smallNum / bigNum) * 100)) + "%";

    switch (mode) {
      case "duration_ms":
        modeText = "seconds longer";
        amountMore = durationMore;
        break;
      case "danceability":
        modeText = "more danceable";
        break;
      case "valence":
        modeText = "more upbeat";
        break;
    }

    switch (mode) {
      case "popularity":
        return `You have listened to ${options[answer].data.name} ${amountMore} more than ${small.data.name}.`;
      default:
        return `${options[answer].data.name} is ${amountMore} ${modeText} than ${small.data.name}.`;
    }
  }
}
