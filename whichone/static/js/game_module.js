function Game(data, view, game) {
  const MAX_LIVES = 3;
  const TIME_LIMIT = 12;
  const options = { 1: {}, 2: {} };
  const MODES = {
    ARTIST_POPULARITY: "artist_popularity",
    TRACK_POPULARITY: "track_popularity",
    DANCEABILITY: "danceability",
    VALENCE: "valence",
    DURATION: "duration_ms",
  };

  const SOUNDS = {
    CORRECT: "/static/resources/correct.mp3",
    INCORRECT: "/static/resources/wrong.mp3",
    GAMEOVER: "/static/resources/gameover.mp3",
    GAMEOVER10: "/static/resources/gameover_10plus.mp3",
  };

  let countdownInstance = null;

  game.makeGuess = function makeGuess(choice) {
    if (!game.state.stopped && !game.state.paused) {
      game.state.paused = true;
      stopCountdown();
      if (choice === evaluateChoices()) {
        correctAnswer();
      } else {
        incorrectAnswer();
      }
      view.showStats(
        game.state.currentMode,
        options,
        choice,
        game.state.lives,
        (answer = evaluateChoices())
      );
      view.updateScores(game.state.score, game.state.highScore);
    }
  };

  game.spotifyLogout = function spotifyLogout() {
    const url = "https://accounts.spotify.com/en/logout";
    const spotifyLogoutWindow = window.open(
      url,
      "Spotify Logout",
      "width=700,height=500,top=40,left=40"
    );
  };

  game.nextQuestion = function nextQuestion() {
    if (game.state.lives > 0) {
      game.state.paused = false;
      // get a random new question
      game.state.currentMode = getRandomMode();
      runMode(game.state.currentMode);
      // show question + cards / timer
      view.showChoices(game.state.score, game.state.highScore);
      startCountdown();
    } else {
      stopGame();
    }
  };

  game.startGame = function startGame() {
    game.state = getDefaultState();
    if (game.state.ready && game.state.stopped) {
      game.state.stopped = false;
      runMode(game.state.currentMode);
      view.updateLifeIcons(game.state.lives, game.state.cheaterMode);
      view.updateScores(game.state.score, game.state.highScore);
      view.showChoices(game.state.score, game.state.highScore);
      startCountdown();
    }
  };

  function stopGame() {
    game.state.stopped = true;
    if (data.isAudioEnabled()) {
      if (game.state.score >= 10) {
        triggerSound(SOUNDS.GAMEOVER10);
      } else {
        triggerSound(SOUNDS.GAMEOVER);
      }
    }
    view.endGameTransition(game.state.score, game.state.cheaterMode);
  }

  function correctAnswer() {
    game.state.score++;
    if (game.state.score > game.state.highScore) {
      game.state.highScore = game.state.score;
      data.updateHighScore(game.state.highScore);
    }
    if (data.isAudioEnabled()) {
      triggerSound(SOUNDS.CORRECT);
    }
  }

  function incorrectAnswer() {
    game.state.lives--;
    if (data.isAudioEnabled()) {
      triggerSound(SOUNDS.INCORRECT);
    }
    view.updateLifeIcons(game.state.lives, game.state.cheaterMode);
  }

  function triggerSound(src) {
    const audio = new Audio(src);
    audio.oncanplay = function () {
      audio.volume = 0.3;
      audio.play();
    };
    audio.onerror = function () {
      console.error(`Audio source not found (${src})`);
    };
  }

  function countdown() {
    game.state.counter--;
    if (game.state.counter === 0 && !game.state.paused) {
      game.makeGuess(null);
      clearInterval(countdownInstance);
    }
    view.updateCountdown(TIME_LIMIT, game.state.counter);
  }

  function startCountdown() {
    game.state.counter = TIME_LIMIT;
    view.updateCountdown(TIME_LIMIT, game.state.counter);
    if (countdownInstance !== null) {
      clearInterval(countdownInstance);
    }
    countdownInstance = setInterval(countdown, 1000);

    view.toggleCountdownAnimation(true);
  }

  function stopCountdown() {
    clearInterval(countdownInstance);
    view.toggleCountdownAnimation(false, game.state.counter === 0);
  }

  function evaluateChoices() {
    if (
      getValue(game.state.currentMode, options["1"]) >
      getValue(game.state.currentMode, options["2"])
    ) {
      return "1";
    } else {
      return "2";
    }
  }

  function getValue(mode, option) {
    if (mode === MODES.ARTIST_POPULARITY || mode === MODES.TRACK_POPULARITY) {
      return option.data.popularity;
    } else {
      return option.features[mode];
    }
  }

  function runMode(mode) {
    let modeData = [];
    if (mode === MODES.ARTIST_POPULARITY) {
      modeData = data.user.top_artists;
    } else {
      modeData = data.user.top_tracks;
    }

    options["1"].data = getRandomListItem(modeData);
    options["2"].data = getRandomListItem(modeData);

    while (options["1"].data == options["2"].data) {
      options["2"].data = getRandomListItem(modeData);
    }

    if (mode !== MODES.ARTIST_POPULARITY) {
      options["1"].features =
        data.user.audio_features[options["1"].data.id];
      options["2"].features =
        data.user.audio_features[options["2"].data.id];
    }

    view.updateQuestion(mode, options);
  }

  function getRandomListItem(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function getRandomMode() {
    const choiceArray = [MODES.ARTIST_POPULARITY, MODES.TRACK_POPULARITY];
    if (data.user.modes) {
      for (const [mode, enabled] of Object.entries(data.user.modes)) {
        if (enabled) {
          choiceArray.push(mode);
        }
      }
    }
    return choiceArray[Math.floor(Math.random() * choiceArray.length)];
  }

  function getDefaultState() {
    return {
      ready: data.isDataReady(),
      stopped: true,
      paused: false,
      lives: MAX_LIVES,
      score: 0,
      previousScore: 0,
      highScore: data.user.highScore,
      cheaterMode: false,
      counter: TIME_LIMIT,
      currentMode: getRandomMode(),
    };
  }
}
