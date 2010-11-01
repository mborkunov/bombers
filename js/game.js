var Game = Class.create({
    container: $("game-container"),
    screen: null,
    graphics: null,
    state: null,
    initialize: function() {
        Game.instance = this;
        this.setScreen(new Start());
        this.graphics = new Graphics();
        this.state = new State();
    },
    start: function() {
        this.graphics.start();
        this.state.start();
    },
    setScreen: function(screen) {
        if (this.screen !== null) {
            this.dispatchScreen();
        }
        for (var event in screen.listeners) {
            if (event.indexOf("key") === 0) {
                document.observe(event, screen.listeners[event], false);
            } else {
                this.container.observe(event, screen.listeners[event].bind(screen));
            }
        }
        this.container.removeClassName(this.screen ? this.screen.name.toLowerCase() : null).addClassName(screen.name.toLowerCase());
        this.screen = screen;
    },
    getScreen: function() {
        return this.screen;
    },
    dispatchScreen: function() {
        this.dispatchListeners();
        this.screen.dispatch();
    },
    dispatchListeners: function() {
        for (var event in this.screen.listeners) {
            if (event.indexOf("key") === 0) {
                document.stopObserving(event, this.screen.listeners[event], false);
            } else {
                this.container.stopObserving(event, this.screen.listeners[event]);
            }
        }
    }
});