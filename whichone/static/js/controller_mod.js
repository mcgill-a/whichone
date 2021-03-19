// controller_mod.js
function Controller(input, output) {
  const args = input;

  const sign_out = args.document.getElementById("sign-out");
  const play_again = args.document.getElementById("play-again");
  const next_question = args.document.getElementById("next-question");
  const mute_icon = args.document.getElementById("mute-icon");
  const choices = args.document.querySelectorAll(".choice");
  const mode_toggles = args.document.querySelectorAll("input[name=toggle]");

  sign_out.onclick = function () {
    args.game.spotifyLogout();
  };

  play_again.onclick = function () {
    args.game.startGame();
  };

  next_question.onclick = function () {
    args.game.nextQuestion();
  };

  mute_icon.onclick = function () {
    args.data.toggleMute();
    args.view.updateMuteIcon(args.data.isAudioEnabled());
  };

  choices.forEach((choice) => {
    choice.onclick = function () {
      args.game.makeGuess(choice.getAttribute("data-choice"));
    };
  });

  mode_toggles.forEach((toggle) => {
    toggle.onclick = function () {
      args.data.toggleMode(toggle);
    };
  });
}
