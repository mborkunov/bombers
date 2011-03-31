if (typeof(console) === "undefined") {
    console = {log: function() {}};
}

document.observe("dom:loaded", function() {
     var scripts = [
         "js/worker.js",
         "js/sound.js",
         "js/game.js",
         "js/util/menu.js",
         "js/game/screen.js",
         "js/game/intro.js",
         "js/game/credits.js",
         "js/game/editor.js",
         "js/game/help.js",
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
         "js/game/tiles/map.js",
         "js/game/objects/object.js",
         "js/game/objects/arbiter.js",
         "js/game/objects/bomber.js",
         "js/game/objects/bomb.js",
         "js/game/objects/corpse.js",
         "js/game/objects/explosion.js",
         "js/game/objects/extras/extra.js",
         "js/game/objects/extras/bomb.js",
         "js/game/objects/extras/glove.js",
         "js/game/objects/extras/kick.js",
         "js/game/objects/extras/power.js",
         "js/game/objects/extras/skateboard.js",
         "js/game/objects/extras/viagra.js",
         "js/game/objects/extras/joint.js",
         "js/game/controllers/controller.js",
         "js/game/controllers/keyboard.js",
         "js/game/controllers/mouse.js",
         "js/game/controllers/ai.js"
     ];

    document.onmousedown = function() {return false;} // disable text selection - chromium
    require(scripts, function() {
        new Game().start();
    });
});
