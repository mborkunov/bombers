define('screens/editor', ['screens/screen'], function() {
  Game.Screen.Editor = Class.create(Game.Screen, {
    name: 'Editor',
    rendered: false,
    init: function() {
      this.listeners = {
        click: function(e) {
        },
        keydown: function(e) {
          Game.instance.setScreen(Game.Screen.Menu);
        }
      };
    },
    dispatch: function($super) {
      $super();
    },
    update: function(delay) {
    },
    render: function(delay) {
    }
  });
});

