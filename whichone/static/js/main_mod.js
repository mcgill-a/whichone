const view = {};
const data = { user: null };
const game = {};
const controller = {};

const initialisePage = function initialisePage(audioState, toggles) {
  view.updateMuteIcon(audioState);
  view.updateModeToggles(toggles);
};

// View module dependencies
const inView = { document };
View(inView, view);

// Data module dependencies
const inData = {
  spotify_id: document.getElementById("info").getAttribute("data-user"),
  initialisePage,
};
Data(inData, data);
data.init();

// Game module dependencies
const inGame = { data: data, view: view };
Game(inGame, game);

// Controller module dependencies
const inController = { game: game, data: data, view: view, document };
Controller(inController, controller);
