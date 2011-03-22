Tile.Box = Class.create(Tile, {
  initialize: function($super, x, y) {
    $super(x, y);
    this.name = 'box';
  }
});