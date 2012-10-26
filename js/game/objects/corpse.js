define('objects/corpse', ['objects/object'], function() {
  Game.Object.CorpsePart = Class.create(Game.Object, {
    location: null,
    index: null,
    flied: null,
    lifetime: null,
    minLifetime: 1000,
    finishTime: null,
    initialize: function($super, location, index) {
      this.location = location;
      this.index = index;
      this.flied = false;
      this.flySpeed = 30;
      this.finishTime = -1;
      this.lifetime = this.minLifetime + Math.floor(Math.random() * 3000);
    },
    render: function($super, container) {
      if (!this.element && container) {
        this.element = new Element('div').setStyle({
          top: (this.location.getY() * 40) + 'px',
          left: (this.location.getX() * 40) + 'px'
        }).addClassName('corpse-part').addClassName('corpse-part-' + this.index).addClassName('object');
        container.appendChild(this.element);
      }

      if (this.isFlying()) {
        this.element.style.setProperty('z-index', 200, null);
      } else {
        this.element.style.setProperty('z-index', 11, null);
      }
      $super();
    },
    update: function($super, delay, map) {
      if (!this.isFlying() && !this.flied) {
        var random = map.getRandomTileByType(Game.Tile.Ground);
        if (random) {
          this.flied = true;
          this.flyTo(random, function() {
            this.finishTime = now();
          }.bind(this));
        }
      }
      if (this.finishTime > 0 && now() - this.finishTime > this.lifetime) {
        this.remove();
      }
      $super(delay);
    }
  });
});
