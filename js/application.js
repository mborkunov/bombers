if (Object.isUndefined(console)) {
  window.console = {
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

if ('onhashchange' in window) {
  //console.log('load', window, window.__proto__.onhashchange);

  /*window.hashChangeHandler = function(e) {
    if (window.hashChangeEnabled) {
      var _screen = e.target.location.hash.substr(1).toLowerCase();
      _screen = _screen.substr(0, 1).toUpperCase() + _screen.substr(1);
      Game.instance.setScreen(Game.instance.getScreenByName(_screen));
    }
  };*/
  //window.onhashchange = window.hashChangeHandler;
}


document.observe("dom:loaded", function() {
  document.onmousedown = function() {return false}; // disable text selection - chromium
  document.oncontextmenu = function() {return false}; // disable context menu

  require({
      baseUrl: 'js/game',
      waitSeconds: 15
    }, [
      'js/util/common.js', 'js/util/point.js', 'js/util/square.js',
      'js/worker.js', 'js/sound.js', 'js/game.js', 'js/config.js',
      'screens', 'tiles', 'objects', 'controllers'
    ], function() {
    Config.initialize({
      onSuccess: function() {
        console.info('config was successfully loaded');
        new Game().start();
      },
      onFailure: function() {
        console.error('cannot load config file');
      }
    });
  });
});
