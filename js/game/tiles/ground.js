Tile.Ground = Class.create(Tile, {
  initialize: function($super, location) {
    $super(location);
    this.name = 'ground';
    this.passable = true;
  }
});
