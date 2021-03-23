const data = { user: null };
const view = {};
const game = {};
const controller = {};
const spotify_id = document.getElementById("info").getAttribute("data-user");

Data(spotify_id, initialisePage, data);
View(document, view);
Game(data, view, game);
Controller(spotify_id, game, data, view, document, controller);

start();

async function start(user_data = null) {
  if (user_data === null) {
    user_data = await controller.fetchData();
  }
  data.init(user_data);
}

const initialisePage = function initialisePage(audioState, toggles) {
  view.updateMuteIcon(audioState);
  view.updateModeToggles(toggles);
};
