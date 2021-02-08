async function requestSongs() {
    try {
        let url = "/2songs";
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch(error) {
        console.error("API unavailable. Please try again later.");
    }
}

async function processSongs() {
    let result = await requestSongs();
    if (result == [] || result == undefined || !result) {
        console.error("No data returned from API");
    } else if (result) {
        
        // do something with it here
        console.log(result);
    }
}