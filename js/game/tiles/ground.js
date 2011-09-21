define('tiles/ground', ['tiles/tile'], function() {
  Game.Tile.Ground = Class.create(Game.Tile, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'ground';
      this.passable = true;
    }
  });
});
