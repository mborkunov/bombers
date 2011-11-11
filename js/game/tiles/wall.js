define('tiles/wall', ['tiles/tile'], function() {
  Game.Tile.Wall = Class.create(Game.Tile, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'wall';
      this.passable = false;
      this.blocking = true;
    },
    prerender: function($super, container) {
      this.container = container;
      $super(container);

      if (Config.getValue('debug')) {
        this.element.stopObserving("click", this.clickHandler);
        this.element.on("click", function() {
          this.destroy();
          Sound.play("crunch");
        }.bind(this));
      }
    },
    destroy: function($super) {
      this.next = new Game.Tile.Ground(this.getLocation().clone());
      $super();
    },
    vanish: function() {
      Sound.play('crunch');
      //this.vanishing = -1;
      this.destroy();
    },
    render: function($super, container) {
      $super(container);
    }
  });
});
