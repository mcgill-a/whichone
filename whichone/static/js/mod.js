// moduleA.js
//
// Notice the ";" before "function", it makes sure "function" is a new instruction when the script is loaded from a host script
// A module is a function which creates a local scope inaccessible from the outside.
// Import dependencies are passed as function parameter.
// Exports are also passed as function paramater. In order to make code public simply set a property on the export object.
;function moduleA(input, output){
    const args = input;
    function priv() {

    }
    output.public1 = function public1() {
        console.log("public 1");
     } 
    output.public2 = function public2() {
        console.log("public 2");
    }

    output.getData = function getData() {
        console.log(args.spotify_id);
        return {top_tracks: [1,2,3]}
    }
};