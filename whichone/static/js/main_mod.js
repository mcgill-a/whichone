// Data module dependencies
const inData = { spotify_id: $("#info").data("user") };
// Data module exports
const data = { user: null };

Data(inData, data);
console.log(data.user);


// Game module dependencies
const inGame = { data:data }
// Game module exports
const game = { }
Game(inGame, game);

game.startGame();

game.stopGame();


/*
const inB = { 
    window,     // this is how you pass a host object to a module - never call a host object directly from your code 
    document,   // or you will not be able to unit test it
    undefined,  // or you may use a host object someone else may have overwritten before it is available to you,
    A: outA,    // now you can consume moduleA inside moduleB without resorting to globals
};
const outB = {};
moduleB(inB, outB);

// do something with outA or outB

*/
