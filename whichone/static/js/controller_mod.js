// controller_mod.js
function Controller(input, output) {
  const args = input;

  const sign_out = args.document.getElementById("sign-out");
  const play_again = args.document.getElementById("play-again");
  const stat_next = args.document.getElementById("stat-next");
  const mute_icon = args.document.getElementById("mute-icon");
  const choices = args.document.querySelectorAll(".choice");
  const mode_toggles = args.document.querySelectorAll("input[name=toggle]");

  sign_out.onclick = function () {
    console.log("Sign out");
    args.game.spotifyLogout();
  };

  play_again.onclick = function () {
    if (args.game.state.stopped) {
      console.log("Play again");
      args.game.startGame();
    }
  };

  stat_next.onclick = function () {
    if (!args.game.state.stopped) {
      args.game.nextScreen();
    }
  };

  mute_icon.onclick = function () {
    console.log("Update mute icon");
  };

  choices.forEach((choice) => {
    choice.onclick = function () {
      if (!args.game.state.paused && !args.game.state.stopped) {
        args.game.makeGuess(choice.getAttribute("data-choice"));
        console.log("Make guess");
      }
    };
  });

  mode_toggles.forEach((toggle) => {
    toggle.onclick = function () {
      args.data.storeEnabledModes(toggle);
    };
  });
}
