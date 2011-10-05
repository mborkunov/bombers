define('screens/levels', ['screens/screen'], function() {
  Game.Screen.Levels = Class.create(Game.Screen, {
    name: 'Levels',
    rendered: null,
    init: function() {
      this.rendered = false;
      this.listeners = {
        click: function(e) {
        },
        keydown: function(e) {
          if (e.keyCode == 27 || e.keyCode == 13) {
            Game.instance.setScreen(Game.Screen.Menu);
          }
        }.bind(this)
      };
    },
    dispatch: function($super) {
    },
    update: function(delay) {
    },
    render: function(delay) {
      if (!this.rendered) {
        this.rendered = true;
      }
    }
  });
});
