// Data module dependencies
const inData = { spotify_id: $("#info").data("user") };
// Data module exports
const data = { user: null };
Data(inData, data);
console.log(data.user);

// Game module dependencies
const inGame = { data: data };
// Game module exports
const game = { };
Game(inGame, game);

// Controller module dependencies
const inController = { game: game, data:data, document }
// Controller module exports
const controller = { };
Controller(inController, controller);

// View module dependencies
const inView = { document };
// View module exports
const view = { };
View(inView, view);
