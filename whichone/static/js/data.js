function localDataFound() {
    // get data from local storage instead of the web server
    let expire = localStorage.getItem("expire");
    let tracks = localStorage.getItem("top_tracks");
    let artists = localStorage.getItem("top_artists");
    let features = localStorage.getItem("audio_features");
    let score = localStorage.getItem("high_score");

    const EXPIRATION_TIME = 604800000; // 1 week (milliseconds)

    if (expire != null) {
        // If the expiration time has passed, we need to get new data instead of using the local storage
        if (new Date().getTime() - new Date(JSON.parse(expire)) > EXPIRATION_TIME) {
            return false;
        }
    }

    if (tracks != null && artists != null && features != null) {
        user['top_artists'] = JSON.parse(artists);
        user['top_tracks'] = JSON.parse(tracks);
        featuresDict = JSON.parse(features);

        if (score != null) {
            highScore = parseInt(score, 10);
            if (Number.isNaN(highScore)) {
                highScore = 0;
            } else {
                document.getElementById("high_score").textContent = highScore;
            }
        }

        return true;
    } else {
        return false;
    }
}


async function getAudioFeatures(tracks) {
    let trackIds = [];

    if (tracks != null) {
        tracks.forEach(track => {
            trackIds.push(track.id);
        });

        $.ajax({
            type: "POST",
            url: "/audio_features",
            data: JSON.stringify({
                "track_ids": trackIds
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                featuresDict = {};
                data.forEach(result => {
                    featuresDict[result['id']] = result;
                });
                localStorage.setItem("expire", JSON.stringify(new Date().getTime()));
                localStorage.setItem("audio_features", JSON.stringify(featuresDict));
            },
            error: function (errMsg) {
                console.log(errMsg);
                featuresDict = {};
            },
            timeout: 3000
        });
    }
}


async function getSpotifyData() {
    $.ajax({
        type: "GET",
        url: "/top_artists",
        success: function (data) {
            user['artists'] = data;
            localStorage.setItem("expire", JSON.stringify(new Date().getTime()));
            localStorage.setItem("top_artists", JSON.stringify(artists));
            compareArtists();
        },
        error: function () {
            console.error("API unavailable. Please try again later.");
        },
        timeout: 5000
    });

    $.ajax({
        type: "GET",
        url: "/top_tracks" + param,
        success: function (data) {
            user['top_tracks'] = data;
            localStorage.setItem("expire", JSON.stringify(new Date().getTime()));
            localStorage.setItem("top_tracks", JSON.stringify(tracks));
            getAudioFeatures(user['top_tracks']);
        },
        error: function () {
            console.error("API unavailable. Please try again later.");
        },
        timeout: 5000
    });
}