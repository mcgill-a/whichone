function localDataFound() {
    // get data from local storage instead of the web server
    let data = localStorage.getItem("user");
    const EXPIRATION_TIME = 604800000; // 1 week (milliseconds)

    if (data != null) {
        
        user = JSON.parse(data);
        // check if their data is outdated
        if (user.expire != null) {
            // If the expiration time has passed, we need to get new data instead of using the local storage
            if (new Date().getTime() - new Date(user.expire) > EXPIRATION_TIME) {
                return false;
            }
        } else {
            return false;
        }

        if (user.high_score != null) {
            if (Number.isNaN(user.high_score)) {
                user.high_score = 0;
            } else {
                document.getElementById("high_score").textContent = user.high_score;
            }
        }
        return true;
    } else {
        return false;
    }
}


async function getAudioFeatures() {
    let trackIds = [];
    if (user.top_tracks != null && user.top_tracks.length > 0) {
        user.top_tracks.forEach(track => {
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
                user['audio_features'] = {};
                data.forEach(result => {
                    user['audio_features'][result['id']] = result;
                });
                user['expire'] = new Date().getTime();
                localStorage.setItem("user", JSON.stringify(user));
            },
            error: function (errMsg) {
                console.log(errMsg);
                user['audio_features'] = {};
            },
            timeout: 3000
        });
    } else {
        console.error("Audio features unavailable (no tracks loaded).");
    }
}

async function request(key, callback) {
    $.ajax({
        type: "GET",
        url: "/" + key,
        success: function (data) {
            user[key] = JSON.parse(data);
            user['expire'] = new Date().getTime();
            localStorage.setItem("user", JSON.stringify(user));
            callback();
        },
        error: function () {
            console.error("API unavailable. Please try again later.");
        },
        timeout: 5000
    });
}

async function getSpotifyData() {
    await request("top_artists", compareArtists);
    await request("top_tracks", getAudioFeatures);
}