var Arbiter = Class.create(GameObject, {
  running: null,
  initialize: function($super) {
    $super();
    this.x = -1;
    this.y = -1.1;
    this.running = true;
  },
  render: function($super, container) {
    if (!this.element && container) {
      this.container = container;
      this.element = new Element('div', {id: 'arbiter'}).setStyle({
        top: (this.y * 40) + 'px',
        left: (this.x * 40)+ 'px'
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
    if (!this.isFlying()) {
      var random = map.getRandomTile();
      if (random) {
        this.flyTo(random);
      }
    }
    $super();
  }
});