define('objects/explosion', ['objects/object'], function() {
  Game.Object.Explosion = Class.create(Game.Object, {
    growSpeed: null,
    size: null,
    initialize: function($super, location) {
      this.growSpeed = .5;
      this.location = location;
    },
    render: function($super, container) {
      if (!this.element && container) {
        this.element = new Element('div').setStyle({
          top: (this.location.getY() * 40) + 'px',
          left: (this.location.getX() * 40) + 'px'
        }).addClassName('explosion');
        container.appendChild(this.element);
      }

      $super();
    },
    dispatch: function($super) {
      $super();
    },
    update: function($super, delay, map) {
      if (!this.isFlying() && !this.isFalling()) {
        var tile = map.getTile(this.location.getX(), this.location.getY());
        if (tile.getName() == 'none' || tile.isDestroyed()) {
          this.fall();
        }
      }
      $super(delay);
    }
  });
});
