const data = { user: null };
const view = {};
const game = {};
const controller = {};
const spotify_id = document.getElementById("info").getAttribute("data-user");

const initialisePage = function initialisePage(audioState, toggles) {
  view.updateMuteIcon(audioState);
  view.updateModeToggles(toggles);
};

Data(spotify_id, initialisePage, data);
View(document, view);
Game(data, view, game);
Controller(spotify_id, game, data, view, document, controller);
controller.fetchData();
