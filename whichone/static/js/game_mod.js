// game_mod.js
function Game(input, output) {
  const args = input;

  const MAX_LIVES = 3;

  const modes = {
    ARTIST_POPULARITY: "artist_popularity",
    TRACK_POPULARITY: "track_popularity",
    DANCEABILITY: "danceability",
    VALENCE: "valence",
    DURATION: "duration",
  };

  output.state = getDefaultState();

  output.startGame = function startGame() {
    console.log("Start game");
    output.state = getDefaultState(stopped=false);
  };

  output.stopGame = function stopGame() {
    console.log("Stop game");
    output.state.stopped = true;
  };

  output.makeGuess = function makeGuess(choice) {
    console.log(choice);

    


  }

  output.spotifyLogout = function spotifyLogout() {
    const url = "https://accounts.spotify.com/en/logout";
    const spotifyLogoutWindow = window.open(
      url,
      "Spotify Logout",
      "width=700,height=500,top=40,left=40"
    );
  }

  function getRandomMode() {
    const choiceArray = [modes.ARTIST_POPULARITY, modes.TRACK_POPULARITY]; 
    if(args.data.user.modes) {
      for (const [mode,enabled] of Object.entries(args.data.user.modes)) {
        if (enabled) {
          choiceArray.push(mode);
        }
      }
    }
    return choiceArray[Math.floor(Math.random() * choiceArray.length)]
  }

  function getDefaultState(stopped=true) {
    return {
      stopped,
      paused: false,
      lives: MAX_LIVES,
      score: 0,
      previousScore: 0,
      cheaterMode: false,
      currentMode: getRandomMode(),
    };
  }
}