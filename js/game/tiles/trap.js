define('tiles/trap', ['tiles/ground'], function() {
  Game.Tile.Trap = Class.create(Game.Tile.Ground, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'trap';
    }
  });
});
