define('objects/explosion', ['objects/object'], function() {
  Game.Object.Explosion = Class.create(Game.Object, {
    growSpeed: null,
    size: null,
    power: null,
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
      } else if (this.element) {
        this.location.increaseY(-0.01);

        this.element.style.top = (this.location.getY() * 40) + 'px';
        this.element.style.height = (parseInt(this.element.style.height) + 2) + 'px';
      }
      $super();
    },
    dispatch: function($super) {
    },
    update: function($super, delay, map) {
      if (!this.isFlying() && !this.isFalling()) {
        var tile = map.getTile(this.location.getX(), this.location.getY());
        if (tile.getName() == 'none' || tile.isDestroyed()) {
          this.fall();
        }
      }
      //this.beans.
      $super(delay);
    }
  });
});
