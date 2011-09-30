if (Object.isUndefined(console)) {
  console = {
    log: function() {},
    info: function() {}
  };
}

if (!Object.isUndefined(window.applicationCache)) {
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      window.applicationCache.swapCache();
      if (confirm('A new version of this game is available. Load it?')) {
        window.location.reload();
      }
    }
  }, false);
}
var checkHashChange = true;

document.observe("dom:loaded", function() {
  document.onmousedown = function() {return false}; // disable text selection - chromium
  document.oncontextmenu = function() {return false}; // disable context menu
  if ('onhashchange' in window) {
    /*window.onhashchange = function(e) {
      if (checkHashChange) {
        var _screen = e.target.location.hash.substr(1).toLowerCase();
        _screen = _screen.substr(0, 1).toUpperCase() + _screen.substr(1);
        screen = Game.instance.getScreenByName(_screen);
        Game.instance.setScreen(screen);
      }
    }*/
  }

  require({
      baseUrl: "js/game",
      waitSeconds: 15,
      locale: "ru-ru"
    }, [
      'js/util/common.js', 'js/util/point.js', 'js/util/square.js',
      'js/worker.js', 'js/sound.js', 'js/game.js', 'js/config.js',
      'screens', 'tiles', 'objects', 'controllers'
    ], function() {
    Config.initialize({
      onSuccess: function() {
        new Game().start();
      },
      onFailure: function() {
        console.error('cannot load config file');
      }
    });
  });
});
