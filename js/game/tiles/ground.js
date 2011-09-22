define('tiles/ground', ['tiles/tile'], function() {
  Game.Tile.Ground = Class.create(Game.Tile, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'ground';
      this.passable = true;
    },
    /*prerender: function($super) {
      $super();
    },*/
    /*hasBomb: function() {
      return Game.instance.getScreen().hasBomb(this.location);
    },*/
    hasExtra: function() {
      return this.extra != null;
    },
    getExtra: function() {
      return this.extra;
    }
  });
});
