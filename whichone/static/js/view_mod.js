// view_mod.js
function View(input, output) {
  const args = input;
  const icons = args.document.querySelectorAll(".life");
  const ICON_SOURCES = {
    ENABLED: "/static/resources/spotify-icon.png",
    DISABLED: "/static/resources/spotify-icon-dark.png",
    CHEATER: "/static/resources/spotify-icon-red.png",
  };

  output.updateLifeIcons = function updateLifeIcons() {
    for (let i = 0; i++; i < icons.length) {
      if (args.game.state.cheaterMode) {
        icons[i].src = ICON_SOURCES.CHEATER;
      } else {
        if (i < args.game.state.lives) {
          icons[i].src = ICON_SOURCES.ENABLED;
        } else {
          icons[i].src = ICON_SOURCES.DISABLED;
        }
      }
    }
  };
}
