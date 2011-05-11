Tile.Box = Class.create(Tile, {
  initialize: function($super, location) {
    $super(location);
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
    this.next = new Tile.Ground(this.getLocation().clone());
    $super();
  },
  vanish: function() {
    Sound.play('crunch');
    this.destroy();
  },
  render: function($super, container) {

    /*if (false && this.element) {
      var arbiter = Game.instance.getScreen().objects.arbiter;

      var ax = arbiter.getX(), ay = arbiter.getY();

      var k = (ay - this.y) / (ax - this.x);
      var fi = Math.atan(k);

      var sx = (Math.cos(fi) * 5);
      var sy = (Math.sin(fi) * 5);

      sx = (ax < this.x ? sx  : - sx);
      sy = (ay < this.y ? sy  : - sy);

      this.element.style['box-shadow'] =  sx + 'px ' + sy + 'px 5px black';
      this.element.style['z-index'] = 11;
    }*/

    $super(container);
  }
});