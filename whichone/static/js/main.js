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

        for (item in result.items) {
            console.log(item.name + " AND THE NEXT IN THE LIST IS \n\n")
        }
    }
}