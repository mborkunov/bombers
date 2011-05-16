var Bomber = Class.create(GameObject, {
  controller: null,
  location: null,
  backgroundPosition: null,
  maxBombs: null,
  bombs: [],
  dead: null,
  type: null,
  tall: false,
  initialize: function($super, controller, type, location) {
    this.backgroundPosition = {x: 0, y: 0};
    this.distance = 0;
    this.speed = .05;
    this.maxBombs = 1;
    this.dead = false;
    this.location = location;
    this.type = type;
    this.tall = Bomber.Type[this.type];
    controller.attach(this);
    this.controller = controller;
  },
  isDead: function() {
    return this.dead;
  },
  render: function($super, container) {
    if (!this.element && container) {
      this.element = new Element('div').setStyle({
        top: (this.location.getY() * 40) + 'px',
        left: (this.location.getX() * 40) + 'px'
      }).addClassName('bomber')
        .addClassName('object')
        .addClassName('bomber-' + this.type.toLowerCase());

      if (this.tall) this.element.addClassName('bomber-tall');

      this.element.observe("click", this.kill.bind(this));
      container.appendChild(this.element);
    }
    this.element.style['z-index'] = Math.round(Math.abs(this.location.getY() + (this.tall ? .3 : 0)) * 10) + 11;
    $super();
  },
  kill: function() {
    if (this.dead) return;
    this.dead = true;
    this.controller.deactivate();
    this.element.addClassName('bomber-dead');
    this.element.setAttribute('title', "It's dead");
    Sound.play('die');
  },
  update: function($super, delay, map) {
    if (!this.isFlying()) {
      if (!this.isFalling()) {
        var tile = map.getTile(this.location.getX(), this.location.getY());
        if (tile.getName() == 'none' || tile.isDestroyed()) {
          this.fall();
        }
      }
    }
    $super(delay);
  },
  move: function(direction, delay) {
    if (this.isFlying() || this.isFalling()) return;
    this.location = this.getNextLocation(direction);

    this.distance += this.getSpeed();
    if (this.distance >= .2) {
      this.backgroundPosition.x -= 40;
      if (this.backgroundPosition.x <= -360) {
        this.backgroundPosition.x = 0;
      }
      this.element.style['background-position-x'] = this.backgroundPosition.x + 'px';
      this.distance = 0;
    }
  },
  setSpriteDirection: function(direction) {
    var height = this.element.getHeight();
    var spriteDirection = - height * ((direction + 2) % 4);

    if (this.backgroundPosition.y != spriteDirection) {
      this.element.style['background-position-y'] = (this.backgroundPosition.y = spriteDirection) + 'px';
    }
  },
  getNextLocation: function(direction) {
    var speed = this.getSpeed();
    var offset = .4;

    var tileLocation1 = this.location.clone();
    var tileLocation2 = this.location.clone();
    var nextLocation = this.location.clone();

    var mod = direction % 2 == 0;

    var dynamicDirection = direction - (mod ? 1 : 2);
    var directionOffset = (speed + offset);

    var deltaX1 = mod ? - offset : - dynamicDirection * directionOffset,
        deltaY1 = mod ? dynamicDirection * directionOffset : - offset;

    var deltaX2 = mod ? offset : - dynamicDirection * directionOffset,
        deltaY2 = mod ? dynamicDirection * directionOffset : offset;

    tileLocation1.increase(deltaX1, deltaY1);
    tileLocation2.increase(deltaX2, deltaY2);

    var tile1 = Game.instance.screen.map.getTile(tileLocation1.getX(), tileLocation1.getY());
    var tile2 = Game.instance.screen.map.getTile(tileLocation2.getX(), tileLocation2.getY());

    var argX, argY;
    if (tile1.isPassable() && tile2.isPassable()) {
      argX = mod ? 0 : - dynamicDirection * speed;
      argY = mod ? dynamicDirection * speed : 0;
      nextLocation.increase(argX, argY);
      this.setSpriteDirection(direction);
    } else {
      var dir1 = tileLocation1.getX() < nextLocation.getX() ? 3 : 1,
          dir2 = tileLocation1.getY() < nextLocation.getY() ? 0 : 2;
      var dir = mod ? dir1 : dir2;
      if (tile1.isPassable()) {
        argX = mod ? - speed : 0;
        argY = mod ? 0 : - speed;
        nextLocation.increase(argX, argY);
        this.setSpriteDirection(dir);
      } else if (tile2.isPassable()) {
        argX = mod ? speed : 0;
        argY = mod ? 0 : speed;
        nextLocation.increase(argX, argY);
        this.setSpriteDirection((dir + 2) % 4);
      }
    }
    return nextLocation;
  },
  spawnBomb: function() {
    if (this.bombs.length < this.maxBombs) {
      this.bombs.push(1);
      Sound.play('putbomb');
      //setTimeout(function() {this.bombs.remove()}.bind(this))
    }
  },
  throwBomb: function() {},
  kick: function() {},
  explode: function() {}
});

Object.extend(Bomber, {
  Type: {
    TUX: true, BSD: true, SPIDER: false, SNAKE: true,
    'BALL-RED': false, 'BALL-YELLOW': false, 'BALL-GREEN': false, 'BALL-BLUE': false
  }
});