define('controllers/ai', ['controllers/controller'], function() {
  // todo: ai controller
  Game.Controller.Ai = Class.create(Game.Controller, {
    initialize: function($super) {
      $super();
      this.direction = 0;
    },
    update: function(delay) {
      if (!this.active) return;
      if (Math.random() * 10 > 9) {
        this.direction = Math.floor(Math.random() * 4);
      }
      if (Math.random() * 10 > 5) {
        this.bomber.move(this.direction, 20);
      }
    }
  });
});
