Tile.Box = Class.create(Tile, {
  initialize: function($super, x, y) {
    $super(x, y);
    this.name = 'box';
  },
  prerender: function($super, container) {
    this.container = container;
    $super(container);
    this.element.stopObserving("click", this.clickHandler);
    this.element.on("click", function() {
      Sound.play("crunch");
      this.destroy();
    }.bind(this));
  },
  destroy: function($super) {
    this.next = new Tile.Ground(this.x, this.y);
    $super();
  }
});