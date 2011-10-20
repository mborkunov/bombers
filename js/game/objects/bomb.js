define('objects/bomb', ['objects/object', 'objects/explosion'], function() {
  Game.Object.Bomb = Class.create(Game.Object, {
    location: null,
    bomber: null,
    scaleCounter: null,
    initialize: function($super, location, bomber) {
      this.backgroundPosition = {x: 0, y: 0};
      this.bomber = bomber;
      this.distance = 0;
      this.speed = .05;
      this.location = location;
      this.scaleCounter = 0;
      this.lastUpdate = 0;
    },
    render: function($super, container) {
      if (!this.element && container) {
        this.element = new Element('div').setStyle({
          top: (this.location.getY() * 40) + 'px',
          left: (this.location.getX() * 40) + 'px'
        }).addClassName('bomb');
        this.element.observe("click", this.explode.bind(this));
        container.appendChild(this.element);
      }

      if (this.isFlying()) {
        this.element.style.setProperty('z-index', 200, null);
      } else {
        //this.element.style['z-index'] = Math.round(Math.abs(this.location.getY() + 0) * 10) + 11;
      }
      $super();
    },
    dispatch: function() {
    },
    update: function($super, delay, map) {
      if (!this.isFlying() && !this.isFalling()) {
        var tile = map.getTile(this.location.getX(), this.location.getY());
        if (tile.getName() == 'none' || tile.isDestroyed()) {
          this.fall();
        }
        var time = date();
        if (time - this.lastUpdate > 10) {
          this.lastUpdate = time;
          var scale = 1 + Math.abs(Math.sin(this.scaleCounter+=3 * Math.PI / 180)) / 7;
          this.element.scale(scale, scale);
        }
      }
      $super(delay);
    },
    move: function(direction, delay) {
      if (this.isFlying() || this.isFalling()) return;
      this.location = this.getNextLocation(direction);
      this.distance += this.getSpeed();
    },
    removeBomb: function() {
      this.element.remove();
      Game.Screen.getCurrent().remove(this);
    },
    explode: function() {
      this.removeBomb();
      this.getScreen().objects.explosions.push(new Game.Object.Explosion(this.location.clone(), this.bomber));
      this.getScreen().shakeIt();
      Sound.play("explode");
    }
  });
});
