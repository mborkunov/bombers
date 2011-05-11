Tile.Wall = Class.create(Tile, {
  initialize: function($super, location) {
    $super(location);
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
    this.next = new Tile.Ground(this.getLocation().clone());
    $super();
  },
  vanish: function() {
    Sound.play('crunch');
    //this.vanishing = -1;
    this.destroy();
  },
  render: function($super, container) {

    /*if (false && this.element) {
      var arbiter = Game.instance.getScreen().objects.arbiter;

      var ax = arbiter.getX(), ay = arbiter.getY();

      var k = (ay - this.location.getX()) / (ax - this.x);

      //var angle = k * 180 / Math.PI;

      var sx = Math.round(Math.cos(Math.atan(k)) * 5);
      var sy = Math.round(Math.sin(Math.atan(k)) * 5);

      this.element.style['box-shadow'] = sx + 'px ' + sy + 'px 5px black';
      this.element.style['z-index'] = 11;
    }*/

    $super(container);
  }
});