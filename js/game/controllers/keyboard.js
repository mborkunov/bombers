define('controllers/keyboard', ['controllers/controller'], function() {
  Game.Controller.Keyboard = Class.create(Game.Controller, {
    keys: null,
    initialize: function($super, type) {
      $super();
      this.i = 1;
      this.keys = type;
    },
    update: function(keys, delay) {
      if (!this.active) return;

      var left  = keys.indexOf(this.keys.left)  != -1;
      var right = keys.indexOf(this.keys.right) != -1;
      var down  = keys.indexOf(this.keys.down)  != -1;
      var up    = keys.indexOf(this.keys.up)    != -1;


      if (!(left && right)) {
        if (left) {
          this.bomber.move(3, delay);
        } else if (right) {
          this.bomber.move(1, delay);
        }
      }

      if (!(down && up) && !(left || right)) {
        if (up) {
          this.bomber.move(0, delay);
        } else if (down) {
          this.bomber.move(2, delay);
        }
      }


      if (keys.indexOf(this.keys.action) != -1) {
        this.bomber.spawnBomb();
      }
    }
  });

  Object.extend(Game.Controller.Keyboard, {
    Type: {
      ARROWS: {
        left: Event.KEY_LEFT,
        right: Event.KEY_RIGHT,
        up: Event.KEY_UP,
        down: Event.KEY_DOWN,
        action: Event.KEY_ENTER || 13
      },
      WASD: {
        left: 65,
        right: 68,
        up: 87,
        down: 83,
        action: 9
      },
      IJKL: {
        left: 74,
        right: 76,
        up: 73,
        down: 75,
        action: 32
      }
    }});
});
