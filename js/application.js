if (Object.isUndefined(console)) {
  console = {
    log: function() {},
    info: function() {}
  };
}

window.applicationCache.addEventListener('updateready', function(e) {
  if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
    window.applicationCache.swapCache();
    if (confirm('A new version of this game is available. Load it?')) {
      window.location.reload();
    }
  }
}, false);

document.observe("dom:loaded", function() {
  document.onmousedown = function() {return false}; // disable text selection - chromium
  require({
      baseUrl: "js/game",
      waitSeconds: 15,
      locale: "ru-ru"
    }, [
      'js/util/common.js', 'js/util/menu.js', 'js/util/point.js',
      'js/worker.js', 'js/sound.js', 'js/game.js',
      'screens', 'tiles', 'objects', 'controllers'
    ], function() {
      new Game().start();
  });
});
