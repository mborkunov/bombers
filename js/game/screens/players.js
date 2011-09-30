define('screens/players', ['screens/screen'], function() {
  Game.Screen.Players = Class.create(Game.Screen, {
    name: 'Players',
    rendered: false,
    init: function() {
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
