var user = {artists: null, tracks: null};
window.onload = function() {
    process("artists");
    //process(tracks);
}

async function makeRequest(param) {
    try {
        let url = "/" + param;
        let response = await fetch(url);
        let data = await response.json();
        return data;
    } catch(error) {
        console.error("API unavailable. Please try again later.");
    }
}

async function process(param) {
    let result = await makeRequest(param);
    if (result == [] || result == undefined || !result) {
        console.error("No data returned from API");
    } else if (result) {
        user[param] = result;
    }
}

function compareArtists() {

    if (user.artists == [] || user.artists == undefined || !user.artists) {
        console.error("No data")
    }
    else {

        // accesses "items" section of JSON
        items = Object.values(user.artists)[1];
            
        // lists all the songs in the items
        artistList = Object.values(items);

        // creates 2 reference numbers from available numbers
        listLen = artistList.length;
        num1 = Math.floor(Math.random() * listLen);
        num2 = Math.floor(Math.random() * listLen);

        // reference numbers cannot match
        while (num1 == num2) {
            num2 = Math.floor(Math.random() * listLen);
        } 

        // get data for artist at list position num1
        artist1 = artistList[num1];
        artist1Data = Object.values(artist1);
        artist1Name = Object.values(artist1Data)[6];
        artist1Popularity = Object.values(artist1Data)[7];

        // get data for artist at list position num2
        artist2 = artistList[num2];
        artist2Data = Object.values(artist2);
        artist2Name = Object.values(artist2Data)[6];
        artist2Popularity = Object.values(artist2Data)[7];

        // print data to console
        console.log("Artist Name: " + artist1Name + ". Popularity: " + artist1Popularity);
        console.log("Artist Name: " + artist2Name + ". Popularity: " + artist2Popularity);

        if (artist1Popularity > artist2Popularity) {
            console.log(artist1Name + " is more popular!");
        }
        else if (artist1Popularity < artist2Popularity) {
            console.log(artist2Name + " is more popular!");
        }
        else {
            console.log("These artists are just as popular as one another!");
        }
    }
}

function compareTracks() {

    if (user.tracks == [] || user.tracks == undefined || !user.tracks) {
        console.error("No data")
    }
    else {

        // accesses "items" section of JSON
        items = Object.values(user.tracks)[1];
            
        // lists all the songs in the items
        artistList = Object.values(items);

        // creates 2 reference numbers from available numbers
        listLen = artistList.length;
        num1 = Math.floor(Math.random() * listLen);
        num2 = Math.floor(Math.random() * listLen);

        // reference numbers cannot match
        while (num1 == num2) {
            num2 = Math.floor(Math.random() * listLen);
        } 

        // get data for artist at list position num1
        artist1 = artistList[num1];
        artist1Data = Object.values(artist1);
        artist1Name = Object.values(artist1Data)[6];
        artist1Popularity = Object.values(artist1Data)[7];

        // get data for artist at list position num2
        artist2 = artistList[num2];
        artist2Data = Object.values(artist2);
        artist2Name = Object.values(artist2Data)[6];
        artist2Popularity = Object.values(artist2Data)[7];

        // print data to console
        console.log("Artist Name: " + artist1Name + ". Popularity: " + artist1Popularity);
        console.log("Artist Name: " + artist2Name + ". Popularity: " + artist2Popularity);

        if (artist1Popularity > artist2Popularity) {
            console.log(artist1Name + " is more popular!");
        }
        else if (artist1Popularity < artist2Popularity) {
            console.log(artist2Name + " is more popular!");
        }
        else {
            console.log("These artists are just as popular as one another!");
        }
    }
}