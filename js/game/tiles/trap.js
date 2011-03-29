Tile.Trap = Class.create(Tile.Ground, {
  initialize: function($super, x, y) {
    $super(x, y);
    this.name = 'trap';
  }
});