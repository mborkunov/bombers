Tile.Ice = Class.create(Tile.Ground, {
  initialize: function($super, location) {
    $super(location);
    this.name = 'ice';
  }
});