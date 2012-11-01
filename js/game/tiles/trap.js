define('tiles/trap', ['tiles/ground'], function() {
  Game.Tile.Trap = Class.create(Game.Tile.Ground, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'trap';
    },
    spawnBomb: function($super, bomber) {
      var bomb = $super(bomber);

      function callback(tile, bomb) {
        if (tile instanceof Game.Tile.Trap) {
          var sources = Game.instance.screen.map.findTilesByType(Game.Tile.Trap);
          var randomSource = sources[Math.floor(Math.random() * sources.length)];
          var targets = Game.instance.screen.map.findTilesByType(Game.Tile.Ground);
          var randomTarget = targets[Math.floor(Math.random() * targets.length)];

          if (randomSource === randomTarget) {
            callback(tile, bomb);
          } else {
            bomb.setLocation(randomSource.getLocation().clone());
            bomb.flyTo(randomTarget, callback);
          }
        }
      }

      callback(this, bomb);
      return bomb;
    }
  })
});
