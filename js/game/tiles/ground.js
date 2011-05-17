define('tiles/ground', ['tiles/tile'], function() {
  Game.Tile.Ground = Class.create(Game.Tile, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'ground';
      this.passable = true;
    },
    spawnExtra: function(extra) {
      var _extra = new extra(this.location.clone());
      _extra.render();
      console.log(_extra);
    }
  });
});
