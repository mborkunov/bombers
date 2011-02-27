if (typeof(console) === "undefined") {
    console = {log: function() {}};
}

document.observe("dom:loaded", function() {
     var scripts = [
         "js/worker.js",
         "js/state.js",
         "js/graphics.js",
         "js/game.js",
         "js/util/menu.js",
         "js/game/screen.js",
         "js/game/intro.js",
         "js/game/battle.js",
         "js/game/start.js",
         "js/game/options.js",
         "js/game/exit.js"
     ];

    require(scripts, function() {
        new Game().start();
    });
});