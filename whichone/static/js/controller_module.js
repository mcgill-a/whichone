function Controller(game, data, view, document) {
  const sign_out = document.getElementById("sign-out");
  const play_again = document.getElementById("play-again");
  const next_question = document.getElementById("next-question");
  const mute_icon = document.getElementById("mute-icon");
  const choices = document.querySelectorAll(".choice");
  const mode_toggles = document.querySelectorAll("input[name=toggle]");

  sign_out.onclick = function () {
    game.spotifyLogout();
  };

  play_again.onclick = function () {
    game.startGame();
  };

  next_question.onclick = function () {
    game.nextQuestion();
  };

  mute_icon.onclick = function () {
    data.toggleMute();
    view.updateMuteIcon(data.isAudioEnabled());
  };

  choices.forEach((choice) => {
    choice.onclick = function () {
      game.makeGuess(choice.getAttribute("data-choice"));
    };
  });

  mode_toggles.forEach((toggle) => {
    toggle.onclick = function () {
      data.toggleMode(toggle);
    };
  });
}
