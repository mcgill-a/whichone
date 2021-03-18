// game_mod.js
function Game(input, output) {
  const args = input;

  const MAX_LIVES = 3;
  const options = { 1: {}, 2: {} };
  const MODES = {
    ARTIST_POPULARITY: "artist_popularity",
    TRACK_POPULARITY: "track_popularity",
    DANCEABILITY: "danceability",
    VALENCE: "valence",
    DURATION: "duration",
  };

  output.startGame = function startGame() {
    output.state = getDefaultState();
    if (output.state.ready && output.state.stopped) {
      console.log("Start game");
      output.state.stopped = false;
      runMode(output.state.currentMode);
      args.view.startGameTransition(output.state.score, output.state.highScore);
    }
  };

  output.stopGame = function stopGame() {
    console.log("Stop game");
    output.state.stopped = true;
  };

  output.makeGuess = function makeGuess(choice) {
    if (!output.state.stopped && !output.state.paused) {
      if (choice === evaluateChoices()) {
        correctAnswer();
      } else {
        wrongAnswer();
      }
      args.view.displayStats(
        output.state.currentMode,
        options,
        choice,
        (answer = evaluateChoices())
      );
      args.view.updateScores(output.state.score, output.state.highScore);
    }
  };

  function correctAnswer() {
    console.log("correct");
    output.state.score++;
  }

  function wrongAnswer() {
    console.log("incorrect");
    output.state.lives--;
    args.view.updateLifeIcons(output.state.lives, output.state.cheaterMode);
  }

  function evaluateChoices() {
    return getValue(output.state.currentMode, options["1"]) >
      getValue(output.state.currentMode, options["2"])
      ? "1"
      : "2";
  }

  function getValue(mode, option) {
    if (mode === MODES.ARTIST_POPULARITY || mode === MODES.TRACK_POPULARITY) {
      return option.data.popularity;
    } else {
      return option.features[mode];
    }
  }

  output.spotifyLogout = function spotifyLogout() {
    const url = "https://accounts.spotify.com/en/logout";
    const spotifyLogoutWindow = window.open(
      url,
      "Spotify Logout",
      "width=700,height=500,top=40,left=40"
    );
  };

  function runMode(mode) {
    let modeData = [];
    if (mode === MODES.ARTIST_POPULARITY) {
      modeData = args.data.user.top_artists;
    } else {
      modeData = args.data.user.top_tracks;
    }

    options["1"].data = getRandomListItem(modeData);
    options["2"].data = getRandomListItem(modeData);

    while (options["1"].data == options["2"].data) {
      options["2"].data = getRandomListItem(modeData);
    }

    if (mode !== MODES.ARTIST_POPULARITY) {
      options["1"].features =
        args.data.user.audio_features[options["1"].data.id];
      options["2"].features =
        args.data.user.audio_features[options["2"].data.id];
    }

    args.view.updateQuestion(mode, options);
  }

  function getRandomListItem(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function getRandomMode() {
    const choiceArray = [MODES.ARTIST_POPULARITY, MODES.TRACK_POPULARITY];
    if (args.data.user.modes) {
      for (const [mode, enabled] of Object.entries(args.data.user.modes)) {
        if (enabled) {
          choiceArray.push(mode);
        }
      }
    }
    return choiceArray[Math.floor(Math.random() * choiceArray.length)];
  }

  function getDefaultState() {
    return {
      ready: args.data.isDataReady(),
      stopped: true,
      paused: false,
      lives: MAX_LIVES,
      score: 0,
      previousScore: 0,
      highScore: args.data.user.highScore,
      cheaterMode: false,
      currentMode: getRandomMode(),
    };
  }
}
