// game_mod.js
;function Game(input, output){
    const args = input;

    const MAX_LIVES = 3;

    const modes = {
      POPULARITY: "popularity",
      DANCEABILITY: "popularity",
      VALENCE: "valence",
      DURATION: "duration"
    }

    output.state = getDefaultState();

    output.startGame = function startGame() {
      console.log("Start game");
      output.state = getDefaultState();
    }


    output.stopGame = function stopGame() {
      console.log("Stop game");
    }

    function getDefaultState() {
      return {
        stopped: true,
        paused: false,
        lives: MAX_LIVES,
        score: 0,
        previousScore: 0,
        cheaterMode: false,
        currentMode: modes.POPULARITY
      }
    }

    


};