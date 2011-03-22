Tile.Trap = Class.create(Tile, {
  initialize: function($super, x, y) {
    $super(x, y);
    this.name = 'trap';
  }
});