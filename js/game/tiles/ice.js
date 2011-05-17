define('tiles/ice', ['tiles/ground'], function() {
  Game.Tile.Ice = Class.create(Game.Tile.Ground, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'ice';
    }
  });
});

