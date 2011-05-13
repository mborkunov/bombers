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
        width: '40px',
        height: '40px',
        position: 'absolute',
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

    var dynamicDirection = mod ? (direction - 1) : (2 - direction);
    var directionOffset = (speed + offset);


    if (mod) {
      var asd = direction - 1;
      tileLocation1.increase(offset, asd * directionOffset);
      tileLocation2.increase(- offset, asd * directionOffset);
    } else {
      var asd = direction - 2;
      tileLocation1.increase(asd * - directionOffset, offset);
      tileLocation2.increase(asd * - directionOffset, -offset);
    }


    var tile1 = Game.instance.screen.map.getTile(tileLocation1.getX(), tileLocation1.getY());
    var tile2 = Game.instance.screen.map.getTile(tileLocation2.getX(), tileLocation2.getY());

    if (tile1.isPassable() && tile2.isPassable()) {
        var argX = mod ? dynamicDirection * speed : 0,
            argY = mod ? 0 : dynamicDirection * speed ;
        nextLocation.increase(argY, argX);
        this.setSpriteDirection(direction);
      }/* else if (tile1.isPassable()) {
        var argY = mod ? - speed : 0,
            argX = mod ? 0 : - speed;
        nextLocation.increase(argX, argY);
        this.setSpriteDirection((2 + direction) % 4);
      } else if (tile2.isPassable()) {
        var argY = mod ? speed : 0,
            argX = mod ? 0 : speed;
        nextLocation.increase(argX, argY);
        this.setSpriteDirection((4 + direction) % 4);
      }*/

    /*
    if (direction % 2 == 0) {
      tileLocation1.setY(tileLocation1.getY() + (direction - 1) * (speed + offset));
      tileLocation1.setX(tileLocation1.getX() - offset);
      tileLocation2.setY(tileLocation2.getY() + (direction - 1) * (speed + offset));
      tileLocation2.setX(tileLocation2.getX() + offset);

      var tile1 = Game.instance.screen.map.getTile(tileLocation1.getX(), tileLocation1.getY());
      var tile2 = Game.instance.screen.map.getTile(tileLocation2.getX(), tileLocation2.getY());

      if (tile1.isPassable() && tile2.isPassable()) {
        nextLocation.setY(nextLocation.getY() + (direction - 1) * speed);
        this.setSpriteDirection(direction);
      } else if (tile1.isPassable()) {
        nextLocation.setX(nextLocation.getX() - speed);
        this.setSpriteDirection(3);
      } else if (tile2.isPassable()) {
        nextLocation.setX(nextLocation.getX() + speed);
        this.setSpriteDirection(1);
      }
    } else {
      tileLocation1.setX(tileLocation1.getX() + (2 - direction) * (speed + offset));
      tileLocation1.setY(tileLocation1.getY() - offset);
      tileLocation2.setX(tileLocation2.getX() + (2 - direction) * (speed + offset));
      tileLocation2.setY(tileLocation2.getY() + offset);

      var tile1 = Game.instance.screen.map.getTile(tileLocation1.getX(), tileLocation1.getY());
      var tile2 = Game.instance.screen.map.getTile(tileLocation2.getX(), tileLocation2.getY());

      if (tile1.isPassable() && tile2.isPassable()) {
        nextLocation.setX(nextLocation.getX() - (direction - 2) * speed);
        this.setSpriteDirection(direction);
      } else if (tile1.isPassable()) {
        nextLocation.setY(nextLocation.getY() - speed);
        this.setSpriteDirection(0);
      } else if (tile2.isPassable()) {
        nextLocation.setY(nextLocation.getY() + speed);
        this.setSpriteDirection(2);
      }
    }
    */

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