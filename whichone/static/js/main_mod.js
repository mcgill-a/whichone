// Data module dependencies
const inData = { spotify_id: $("#info").data("user") };
// Data module exports
const data = { user: null };
Data(inData, data);
console.log(data.user);

// View module dependencies
const inView = { document };
// View module exports
const view = {};
View(inView, view);

// Game module dependencies
const inGame = { data: data, view: view };
// Game module exports
const game = {};
Game(inGame, game);

// Controller module dependencies
const inController = { game: game, data: data, view: view, document };
// Controller module exports
const controller = {};
Controller(inController, controller);
