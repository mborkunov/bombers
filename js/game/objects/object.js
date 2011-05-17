define('objects/object', [], function() {
  Game.Object = Class.create({
    canFlyOverWalls: null,
    canKick: null,
    canPassBomber: null,
    stopped: null,
    flying: null,
    falling: null,
    element: null,
    speed: null,
    location: null,
    direction: 2,
    destination: null,
    scale: null,

    initialize: function() {
      this.scale = 1;
    },
    getElement: function() {
      return this.element;
    },
    setDirection: function(direction) {
    },
    snap: function() {
      if (this.direction % 2 == 0) {
        this.location = this.location.roundX();
      } else {
        this.location = this.location.roundY();
      }
    },
    setLocation: function(location) {
      this.location = location;
    },
    getLocation: function() {
      return this.location;
    },
    getSpeed: function() {
      return this.speed;
    },
    setSpeed: function(speed) {
      this.speed = speed;
    },
    increaseSpeed: function(speed) {
      this.speed += speed || 1;
    },
    decreaseSpeed: function(speed) {
      this.speed -= speed || 1;
    },
    fall: function() {
      if (this.falling === null) {
        Sound.play('deepfall');
        this.falling = 1;
        this.element.addClassName('falling'); // todo: move to render
      } else {
        this.falling -= 0.01;
        this.scale = this.falling;
        if (this.falling <= 0) {
          if (this instanceof Game.Object.Bomber) {
            this.controller.deactivate();
            this.dead = true;
          }
          this.element.hide();
        }
      }
    },
    isFalling: function() {
      return this.falling !== null && this.falling > 0;
    },
    isFlying:function() {
      return this.destination !== null && !this.location.equals(this.destination);
    },
    move: function(speed, direction) {

    },
    flyTo: function(tile) {
      this.destination = tile.getLocation();
      this.departure = this.location.clone();
    },
    gainKick: function() {

    },
    loseKick: function() {

    },
    update: function() {
      if (this.isFalling()) {
        this.fall();
        return;
      }
      if (this.isFlying()) {
        var diff = 50; // fly speed
        var speedX = (this.destination.getX() - this.departure.getX()) / diff;
        var speedY = (this.destination.getY() - this.departure.getY()) / diff;

        if (this._check(this.location.getX(), this.destination.getX(), speedX) || this._check(this.location.getY(), this.destination.getY(), speedY)) {
          this.location = this.destination;
          if (this.destination && this instanceof Game.Object.Arbiter) {
            this.getTile(this.destination).vanish();
          }
          this.destination = null;
          this.departure = null;
          this.scale = 1;
        } else {
          this.location.setX(this.location.getX() + speedX);
          this.location.setY(this.location.getY() + speedY);

          var offset = Math.min(this.departure.getX(), this.destination.getX());
          var x1 = this.departure.getX() - offset;
          var x2 = this.destination.getX() - offset;
          var x = this.location.getX() - offset;

          if (this.departure.getX() == this.destination.getX()) {
            offset = Math.min(this.departure.getY(), this.destination.getY());
            x1 = this.departure.getY() - offset;
            x2 = this.destination.getY() - offset;
            x = this.location.getY() - offset;
          }
          var progress = x / Math.abs(x1 - x2);
          this.scale = 1 + Math.sin(progress * Math.PI) * 3;
        }
        if (!this.isFlying() && this instanceof Game.Object.Arbiter) {
          if (this.destination) {
            this.getTile(this.destination).vanish();
          }
        }
      }
    },
    getTile: function(point) {
      return Game.instance.screen.map.getTile(point.getX(), point.getY());
    },
    _check: function(position, destination, diff) {
      return (Math.abs(position - destination) < Math.abs(position + diff - destination));
    },
    render: function() {
      if (this.element) {
        this.element.style.top = (this.location.getY() * 40) + 'px';
        this.element.style.left = (this.location.getX() * 40) + 'px';

        var scale = 'scale(' + this.scale + ')';
        this.element.style['-webkit-transform'] = scale;
        this.element.style['-o-transform'] = scale;
        this.element.style.MozTransform = scale;


        if (this.isFalling()) {
          this.element.style['-webkit-transform'] = 'scale(' + this.falling + ', ' + this.falling + ')';
          this.element.style.opacity = this.falling;
        }
      }
    }
  });
});
