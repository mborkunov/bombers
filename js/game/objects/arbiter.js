var Arbiter = Class.create(GameObject, {
  running: null,
  initialize: function($super) {
    $super();
    this.location = new Point(-1, -1.1);
    this.running = true;
  },
  render: function($super, container) {
    if (!this.element && container) {
      this.container = container;
      this.element = new Element('div', {id: 'arbiter'}).setStyle({
        top: (this.location.getY() * 40) + 'px',
        left: (this.location.getX() * 40)+ 'px'
      }).addClassName('arbiter');

      container.appendChild(this.element);
    }
    $super();
  },
  isRunning: function() {
    return this.running;
  },
  run: function() {
    this.running = true;
  },
  hurry: function() {
    // warn
  },
  update: function($super, delay, map) {
    if (this.running && !this.isFlying()) {
      var random = map.getRandomTile();
      if (random) {
        this.flyTo(random);
      }
    }
    $super();
  }
});