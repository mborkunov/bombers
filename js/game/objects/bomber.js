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
    var speed = this.getSpeed();
    var spriteDirection = this.backgroundPosition.y;
    var height = this.element.getHeight();

    if (this.direction != direction) {
      this.direction = direction;
      this.snap();
    }

    var tileLocation = this.location.clone();
    var nextLocation = this.location.clone();

    switch (direction) {
      case 0:
          spriteDirection = - height * 2;
          tileLocation.setY(this.location.getY() - speed - .5);
          nextLocation.setY(this.location.getY() - speed);
        break;
      case 1:
          spriteDirection = - height * 3;
          tileLocation.setX(this.location.getX() + speed + .5);
          nextLocation.setX(this.location.getX() + speed);
        break;
      case 2:
          spriteDirection = 0;
          tileLocation.setY(this.location.getY() + speed + .5);
          nextLocation.setY(this.location.getY() + speed);
        break;
      case 3:
          spriteDirection = - height;
          tileLocation.setX(this.location.getX() - speed - .5);
          nextLocation.setX(this.location.getX() - speed);
        break;
    }

    var tile = Game.instance.screen.map.getTile(tileLocation.getX(), tileLocation.getY());
    if (tile.isPassable()) {
      this.location = nextLocation;
    }

    if (this.backgroundPosition.y != spriteDirection) {
      this.element.style['background-position-y'] = (this.backgroundPosition.y = spriteDirection) + 'px';
    }
    this.distance += speed;

    if (this.distance >= .2) {
      this.backgroundPosition.x -= 40;
      if (this.backgroundPosition.x <= -360) {
        this.backgroundPosition.x = 0;
      }
      this.element.style['background-position-x'] = this.backgroundPosition.x + 'px';
      this.distance = 0;
    }
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