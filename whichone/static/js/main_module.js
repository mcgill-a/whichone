const view = {};
const data = { user: null };
const game = {};
const spotify_id = document.getElementById("info").getAttribute("data-user");

const initialisePage = function initialisePage(audioState, toggles) {
  view.updateMuteIcon(audioState);
  view.updateModeToggles(toggles);
};

View(document, view);

Data(spotify_id, initialisePage, data);
data.init();

Game(data, view, game);

Controller(game, data, view, document);