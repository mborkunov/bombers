Controller.Keyboard = Class.create(Controller, {
  keys: null,
  initialize: function($super, type) {
    $super();
    this.i = 1;
    this.keys = Controller.Keyboard.Type[type];
  },
  update: function(keys) {
    if (keys.indexOf(this.keys.left) != -1) {
      this.bomber.move(.1, 3);
    } else if (keys.indexOf(this.keys.right) != -1) {
      this.bomber.move(.1, 1);
    } else if (keys.indexOf(this.keys.up) != -1) {
      this.bomber.move(.1, 0);
    } else if (keys.indexOf(this.keys.down) != -1) {
      this.bomber.move(.1, 2);
    }

    if (keys.indexOf(this.keys.action) != -1) {
        console.log("bomb");
        this.bomber.spawnBomb();
        this.i += 0.001;
        this.bomber.getElement().setStyle({"-webkit-transform": "scale(" + this.i + "," + this.i + ")"});
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
      action: Event.KEY_ENTER | 13
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