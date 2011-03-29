Controller.Keyboard = Class.create(Controller, {
  update: function(keys) {
    if (keys.indexOf(Event.KEY_LEFT) != -1) {
      this.bomber.move(2, 3);
    } else if (keys.indexOf(Event.KEY_RIGHT) != -1) {
      this.bomber.move(2, 1);
    } else if (keys.indexOf(Event.KEY_UP) != -1) {
      this.bomber.move(2, 0);
    } else if (keys.indexOf(Event.KEY_DOWN) != -1) {
      this.bomber.move(2, 2);
    }
  }
});