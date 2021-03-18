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
  /* Choice */
  const choice_1_text = args.document.getElementById("text1");
  const choice_1_image = args.document.getElementById("image1");
  const choice_2_text = args.document.getElementById("text2");
  const choice_2_image = args.document.getElementById("image2");

  const ICON_SOURCES = {
    LIFE_ENABLED: "/static/resources/spotify-icon.png",
    LIFE_DISABLED: "/static/resources/spotify-icon-dark.png",
    LIFE_CHEATER: "/static/resources/spotify-icon-red.png",
    SOUND_ENABLED: "/static/resources/volume-on.png",
    SOUND_DISABLED: "/static/resources/volume-off.png",
  };

  output.startGameTransition = function startGameTransition() {
    toggleStartGameClasses();
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
    for (let i = 0; i++; i < life_icons.length) {
      if (cheaterMode) {
        life_icons[i].src = ICON_SOURCES.LIFE_CHEATER;
      } else {
        if (i < lives) {
          life_icons[i].src = ICON_SOURCES.LIFE_ENABLED;
        } else {
          life_icons[i].src = ICON_SOURCES.LIFE_DISABLED;
        }
      }
    }
  };

  output.displayStats = function displayStats(mode, options, choice, answer) {
    console.log("next screen");
  };

  output.updateMuteIcon = function updateMuteIcon(enabled) {
    if (enabled) {
      mute_icon.src = ICON_SOURCES.SOUND_ENABLED;
    } else {
      mute_icon.src = ICON_SOURCES.SOUND_DISABLED;
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
    } else if (mode === "dance") {
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
    console.log(options);
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

  function toggleStartGameClasses() {
    $(".game-over").addClass("disabled");
    $(".time-up").addClass("disabled");
    $(".time-display").removeClass("disabled");
    $(".choice").removeClass("disabled");
    $("#data-popup").removeClass("disabled");
    $("#options-popup").addClass("disabled");
    $("#stat-next").text("Next question");
    $("#stat-next").append(" &#10132;");
    $(".choice").css("opacity", 1);
    $(".choice").css("cursor", "pointer");
    $(".down").css("opacity", 1);
  }
}
