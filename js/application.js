if (typeof(console) === "undefined") {
    console = {log: function() {}};
}

document.observe("dom:loaded", function() {
     var scripts = [
         "js/worker.js",
         "js/state.js",
         "js/graphics.js",
         "js/sound.js",
         "js/game.js",
         "js/util/menu.js",
         "js/game/screen.js",
         "js/game/intro.js",
         "js/game/arena.js",
         "js/game/menu.js",
         "js/game/options.js",
         "js/game/exit.js",
         "js/game/tiles/tile.js",
         "js/game/tiles/ground.js",
         "js/game/tiles/none.js",
         "js/game/tiles/wall.js",
         "js/game/tiles/trap.js",
         "js/game/tiles/ice.js",
         "js/game/tiles/arrow.js",
         "js/game/tiles/box.js",
         "js/game/tiles/map.js"
     ];

    require(scripts, function() {
        new Game().start();
    });
});