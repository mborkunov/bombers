var State = Class.create(Worker, {
    action: function(){
        Game.instance.getScreen().update();
    }
});

