Tile.Ground = Class.create(Tile, {
  initialize: function($super, x, y) {
    $super(x, y);
    this.name = 'ground';
    this.type = 1;
    this.passable = true;
  }
});
