Tile.Wall = Class.create(Tile, {
  initialize: function($super, x, y) {
    $super(x, y);
    this.name = 'wall';
    this.passable = false;
    this.blocking = true;
    this.next = new Tile.Ground();
  },
  vanish: function() {
    this.disappear = true;
  }
});