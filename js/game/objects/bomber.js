define('objects/bomber', ['objects/object'], function() {
  Game.Object.Bomber = Class.create(Game.Object, {
    controller: null,
    location: null,
    backgroundPosition: null,
    maxBombs: null,
    bombs: [],
    dead: null,
    number: null,
    rollAngle: 0,
    tall: false,
    initialize: function($super, controller, number, location) {
      this.backgroundPosition = {x: 0, y: 0};
      this.distance = 0;
      this.speed = .05;
      this.maxBombs = 1;
      this.dead = false;
      this.location = location;
      this.number = number;
      this.tall = false; //Game.Object.Bomber.Type[this.type];
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
        }).addClassName('bomber').addClassName("bomber-" + this.number);

        var eyes = ["cyclope", "stereo", "alien"];
        this.eyes = new Element("div").addClassName("eyes object").addClassName(eyes[Math.floor(Math.random() * 3)]);
        ["first", "second", "third"].each(function(eye) {
          var eye = new Element("div").addClassName(eye + "-eye eye");
          eye.appendChild(new Element("div").addClassName("pupil"));
          this.appendChild(eye);
        }.bind(this.eyes));

        this.element.appendChild(this.eyes);
        this.element.observe("click", this.kill.bind(this));
        container.appendChild(this.element);
      }

      if (this.isFlying()) {
        this.element.style['z-index'] = 200;
      } else {
        this.element.style['z-index'] = Math.round(Math.abs(this.location.getY() + (this.tall ? .3 : 0)) * 10) + 11;
      }

      var angle = 0;
      if (!Object.isUndefined(this.eyes)) {
        if (this.distance >= .1) {
          angle += Math.round(10 * Math.sin(this.rollAngle++));
          if (this.rollAngle >= 360) {
            this.rollAngle = 0;
          }
          this.distance = 0;
        }
      }

      this.eyes.style['-webkit-transform'] = 'rotate(' + (angle + this.rotationAngle) +'deg)';
      $super();
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

      if (this.direction * 90 != this.rotationAngle) {
        var diffAngle = this.direction * 90 - this.rotationAngle;

        if (diffAngle > 0) {
          if (diffAngle > 180) {
            this.rotationAngle -= 20;
          } else {
           this.rotationAngle += 20;
          }
        } else {
          this.rotationAngle -= 20;
        }
      }
      $super(delay);
    },
    move: function(direction, delay) {
      if (this.isFlying() || this.isFalling()) return;
      this.location = this.getNextLocation(direction);
      this.distance += this.getSpeed();
    },
    getNextLocation: function(direction) {
      this.direction = direction;
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
      } else {
        var dir1 = tileLocation1.getX() < nextLocation.getX() ? 3 : 1,
            dir2 = tileLocation1.getY() < nextLocation.getY() ? 0 : 2;
        var dir = mod ? dir1 : dir2;
        if (tile1.isPassable()) {
          argX = mod ? - speed : 0;
          argY = mod ? 0 : - speed;
          nextLocation.increase(argX, argY);
        } else if (tile2.isPassable()) {
          argX = mod ? speed : 0;
          argY = mod ? 0 : speed;
          nextLocation.increase(argX, argY);
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
    kill: function() {
      if (this.dead) return;
      this.dead = true;
      this.controller.deactivate();
      this.element.addClassName('bomber-dead');
      this.element.setAttribute('title', "It's dead");
      Sound.play('die');
    },
    throwBomb: function() {
    },
    kick: function() {
    },
    explode: function() {
    }
  });
});
