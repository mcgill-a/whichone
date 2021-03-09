$(document).ready(function () {
    $(".choice").on("click", function () {
        if (!paused && !stopped) {
            makeGuess($(this).data("choice"));
        }
    });

    $("#sign-out").on("click", function (event) {
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

    $("#mute-icon").on("click", function (event) {
        if (user.muteSound) {
            user.muteSound = false;
            document.getElementById("mute-icon").src =
                "/static/resources/volume-on.png";
        } else {
            user.muteSound = true;
            document.getElementById("mute-icon").src =
                "/static/resources/volume-off.png";
        }
        localStorage.setItem(spotify_id, JSON.stringify(user));
    });

    $('input[name=dance]').change(function () {
        storeEnabledModes();
    });

    $('input[name=valence]').change(function () {
        storeEnabledModes();
    });

    $('input[name=duration]').change(function () {
        storeEnabledModes();
    });
});