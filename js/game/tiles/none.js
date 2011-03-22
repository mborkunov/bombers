Tile.None = Class.create(Tile, {
  initialize: function($super, x, y) {
    $super(x, y);
    this.name = 'none';
    this.type = 0;
  }
});
