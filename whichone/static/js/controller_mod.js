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
    console.log("Play again");
    args.game.startGame();
  };

  stat_next.onclick = function () {
    console.log("Next screen");
    args.game.nextScreen();
  };

  mute_icon.onclick = function () {
    args.data.toggleMute();
    args.view.updateMuteIcon(args.data.user.muteSound);
  };

  choices.forEach((choice) => {
    choice.onclick = function () {
      console.log("Make guess");
      args.game.makeGuess(choice.getAttribute("data-choice"));
    };
  });

  mode_toggles.forEach((toggle) => {
    toggle.onclick = function () {
      args.data.toggleMode(toggle);
    };
  });
}
