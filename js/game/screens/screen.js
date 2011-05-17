define('screens/screen', [], function() {
  Game.Screen = Class.create({
    game: null,
    container: null,
    keys: null,
    listeners: null,
    initialize: function() {
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
    render: function() {
    },
    dispatch: function() {
      this.container.update();
      this.rendered = false;
      this.listeners = {};
    }
  });
});
