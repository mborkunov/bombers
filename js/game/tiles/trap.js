Tile.Trap = Class.create(Tile.Ground, {
  initialize: function($super, location) {
    $super(location);
    this.name = 'trap';
  }
});