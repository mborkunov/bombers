var GameObject = Class.create({
  canFlyOverWalls: null,
  canKick: null,
  canPassBomber: null,
  stopped: null,
  flying: null,
  falling: null,
  element: null,
  speed: null,
  x: null,
  y: null,
  direction: null,
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

  },
  setPosition: function(x, y) {

  },
  getX: function() {

  },
  getY: function() {

  },
  setOffset: function(x, y) {

  },
  getSpeed: function() {
    return this.speed;
  },
  setSpeed: function(speed) {
    this.speed = speed;
  },
  increaseSpeed: function(s) {
    this.speed += s || 1;
  },
  decreaseSpeed: function(s) {
    this.speed -= s || 1;
  },
  fall: function() {
    if (this.falling === null) {
      Sound.play('deepfall');
      this.falling = 1;
    } else {
      this.falling -= 0.004;
    }
  },
  isFalling: function() {
    return this.falling !== null && this.falling > 0;
  },
  isFlying:function() {
    return this.destination !== null && this.destination.getX() != this.x && this.destination.getY() != this.y;
  },
  move: function(speed, direction) {

  },
  flyTo: function(tile) {
    this.destination = tile;
    this.departure = [this.x, this.y]
  },
  gainKick: function() {
    
  },
  loseKick: function() {

  },
  update: function() {
    if (this.isFalling()) {
      this.fall();
      return false;
    }
    if (this.isFlying()) {
      var diff = 10;
      var speedX = (this.destination.getX() - this.departure[0]) / diff;
      var speedY = (this.destination.getY() - this.departure[1]) / diff;

      if (this._check(this.x, this.destination.getX(), speedX) || this._check(this.y, this.destination.getY(), speedY)) {
        this.x = this.destination.getX();
        this.y = this.destination.getY();
        if (this.destination) {
          this.getTile(this.destination).vanish();
        }
        this.destination = null;
        this.departure = null;
        this.scale = 1;
      } else {
        this.x += speedX;
        this.y += speedY;

        var offset = Math.min(this.departure[0], this.destination.getX());
        var x1 = this.departure[0] - offset;
        var x2 = this.destination.getX() - offset;
        var x = this.x - offset;

        if (x1 == x2) {
          offset = Math.min(this.departure[1], this.destination.getY());
          x1 = this.departure[1] - offset
          x2 = this.destination.getY() - offset;
          x  = this.y - offset;
        }
        var progress = x / Math.abs(x1 - x2);
        this.scale = 1 + Math.sin(progress * Math.PI);
      }
      if (!this.isFlying()) {
        if (this.destination) {
          this.getTile(this.destination).vanish();
        }
      }
    }
  },
  getTile: function(object) {
    return object ? object.tile ? object.tile : object : null;
  },
  _check: function(position, destination, diff) {
    return (Math.abs(position - destination) < Math.abs(position + diff - destination));
  }
});