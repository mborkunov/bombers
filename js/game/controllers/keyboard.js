Controller.Keyboard = Class.create(Controller, {
  keys: null,
  initialize: function($super, type) {
    $super();
    this.i = 1;
    this.keys = type;
  },
  update: function(keys, delay) {
    if (!this.active) return;

    if (keys.indexOf(this.keys.left) != -1) {
      this.bomber.move(3, delay);
    } else if (keys.indexOf(this.keys.right) != -1) {
      this.bomber.move(1, delay);
    } else if (keys.indexOf(this.keys.up) != -1) {
      this.bomber.move(0, delay);
    } else if (keys.indexOf(this.keys.down) != -1) {
      this.bomber.move(2, delay);
    }

    if (keys.indexOf(this.keys.action) != -1) {
        this.bomber.spawnBomb();
    }
  }
});

Object.extend(Controller.Keyboard, {
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