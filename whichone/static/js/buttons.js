$(document).ready(function () {
  $(".choice").on("click", function () {
    if (!paused && !stopped) {
      makeGuess($(this).data("choice"));
    }
  });

  $("#sign-out").on("click", function () {
    spotifyLogout();
  });

  $("#play-again").on("click", function () {
    if (stopped) {
      startGame();
    }
  });

  $("#stat-next").on("click", function () {
    if (!stopped) {
      nextScreen();
    }
  });

  $("#mute-icon").on("click", function () {
    user.muteSound = !user.muteSound;
    setMuteIcon();
  });

  $("input[name=toggle]").change(function () {
    storeEnabledModes();
  });
});
