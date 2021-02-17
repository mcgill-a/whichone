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

async function makeRequest(param) {
    try {
        let url = "/" + param;
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch (error) {
        console.error("API unavailable. Please try again later.");
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
            }
        });
    }
}


async function getSpotifyData() {

    let artists = await makeRequest("top_artists");
    if (artists == [] || artists == undefined || !artists) {
        console.error("No data returned from API (param1)");
    } else if (artists) {
        user['top_artists'] = artists;
        localStorage.setItem("expire", JSON.stringify(new Date().getTime()));
        localStorage.setItem("top_artists", JSON.stringify(artists));
    }

    let tracks = await makeRequest("top_tracks");
    if (tracks == [] || tracks == undefined || !tracks) {
        console.error("No data returned from API (param2)");
    } else if (tracks) {
        user['top_tracks'] = tracks;
        localStorage.setItem("expire", JSON.stringify(new Date().getTime()));
        localStorage.setItem("top_tracks", JSON.stringify(tracks));
    }

    compareArtists();
    getAudioFeatures(tracks);
}