Tile.Wall = Class.create(Tile, {
  initialize: function($super, x, y) {
    $super(x, y);
    this.name = 'wall';
    this.passable = false;
    this.blocking = true;
  },
  prerender: function($super, container) {
    this.container = container;
    $super(container);
    this.element.stopObserving("click", this.clickHandler);
    this.element.on("click", function() {
      this.destroy();
      Sound.play("crunch");
    }.bind(this));
  },
  destroy: function($super) {
    this.next = new Tile.Ground(this.x, this.y);
    $super();
  },
  vanish: function() {
    Sound.play('crunch');
    this.destroy();
  }
});