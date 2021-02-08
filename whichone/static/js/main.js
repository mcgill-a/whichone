async function requestSongs(a, b) {
    try {
        let url = "/2songs";
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch(error) {
        console.error("API unavailable. Please try again later.");
    }
}