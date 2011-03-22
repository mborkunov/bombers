var State = Class.create(Worker, {
    action: function(delay) {
        Game.instance.getScreen().update(delay);
    }
});

