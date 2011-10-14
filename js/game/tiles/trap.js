define('tiles/trap', ['tiles/ground'], function() {
  Game.Tile.Trap = Class.create(Game.Tile.Ground, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'trap';
    },
    spawnBomb: function($super, bomber) {
      var bomb = $super(bomber);
      console.log(bomb);
      var tiles = Game.instance.screen.map.findTilesByType(Game.Tile.Trap);
      var randomSource = tiles[Math.ceil(Math.random() * tiles.length)];
      var randomTarget = tiles[Math.ceil(Math.random() * tiles.length)];
      bomb.setLocation(randomSource.getLocation().clone());
      bomb.flyTo(randomTarget);
      return bomb;
    }
  })
});
