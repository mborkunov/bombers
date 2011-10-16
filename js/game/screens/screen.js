define('screens/screen', [], function() {
  Game.Screen = Class.create({
    game: null,
    container: null,
    keys: null,
    listeners: null,
    sleeping: null,
    initialize: function() {
      this.sleeping = false;
      this.keys = [];
      this.listeners = {};
      this.game = Game.instance;
      this.container = Game.instance.container;
      this.init();

    },
    init: function() {
    },
    update: function() {
    },
    prerender: function() {
      
    },
    render: function() {
    },
    setSleeping: function(sleeping) {
      this.sleeping = sleeping;
    },
    dispatch: function() {
      this.container.update();
      this.rendered = false;
      this.listeners = {};
    }
  });

  Object.extend(Game.Screen, {
    getCurrent: function() {
      return Game.instance.getScreen();
    }
  });
});