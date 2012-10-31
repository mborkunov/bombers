define('objects/extras/bomb', ['objects/extras/extra'], function() {
  Game.Object.Extra.Bomb = Class.create(Game.Object.Extra, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'bomb';
    },
    act: function(bomber) {
      bomber.maxBombs++;
    }
  });
});
