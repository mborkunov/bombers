var Graphics = Class.create(Worker, {
    action: function() {
        Game.instance.getScreen().render();
     }
});

