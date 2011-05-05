if (typeof(console) === "undefined") {
  console = {log: function() {}};
}

document.observe("dom:loaded", function() {
  document.onmousedown = function() {return false}; // disable text selection - chromium
  require({
      baseUrl: "js/game",
      waitSeconds: 15,
      locale: "ru-ru"
    }, [
      'js/util/common.js', 'js/util/menu.js',
      'js/worker.js', 'js/sound.js', 'js/game.js',
      'screens', 'tiles', 'objects', 'controllers'
    ], function() {
      new Game().start();
  });
});
