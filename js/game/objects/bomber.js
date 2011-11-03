define('objects/bomber', ['objects/object'], function() {
  Game.Object.Bomber = Class.create(Game.Object, {
    controller: null,
    location: null,
    backgroundPosition: null,
    maxBombs: null,
    canKick: null,
    canThrow: null,
    power: null,
    bombs: null,
    dead: null,
    number: null,
    angle: null,
    rollAngle: null,
    rollingAngle: null,
    initialize: function($super, controller, number, location) {
      this.backgroundPosition = {x: 0, y: 0};
      this.bombs = [];
      this.distance = 0;
      this.rollingAngle = 0;
      this.rollAngle = 0,
      this.angle = 0;
      this.rollAngle = 0;
      this.dead = false;
      this.location = location;
      this.number = number;

      this.speed = .05 + Config.getValue('start.skateboards') * Game.Object.Extra.Skateboard.getSpeed();
      this.maxBombs = Config.getValue('start.bombs');
      this.power = Config.getValue('start.power');
      this.canKick = Config.getValue('start.kick');
      this.canThrow = Config.getValue('start.glove');

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
        }).addClassName('object').addClassName('bomber').addClassName("bomber-" + this.number);

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
        this.element.style['z-index'] = Math.round(Math.abs(this.location.getY() + 0) * 10) + 11;
      }

      if (!Object.isUndefined(this.eyes)) {
        if (this.distance >= .1) {
          this.rollAngle += 60;
          this.rollingAngle = Math.round(5 * Math.sin(this.rollAngle / 180 * Math.PI));
          if (this.rollAngle >= 360) {
            this.rollAngle = 0;
          }
          this.distance = 0;
        }
      }

      this.rotate = (- this.angle + 90 + this.rollingAngle);
      this.eyes.rotate(this.rotate);
      $super();
    },
    update: function($super, delay, map) {
      if (!this.isFlying()) {
        if (!this.isFalling()) {
          var tile = map.getTile(this.location.getX(), this.location.getY());
          if (tile.getName() == 'none' || tile.isDestroyed()) {
            this.fall();
          } else if (tile.getName() == 'ice') {
            this.move(this.direction, delay / 2);
          }
        }
      }

      if (!this.isDead()) {
        var requiredAngle = this.getAngleByDirection(this.direction);
        if (this.angle != requiredAngle) {
          var clockWise = this.getClockWiseDirection(this.angle, requiredAngle);
          var absDiff = Math.abs(requiredAngle - this.angle);

          var diff = (Math.abs(absDiff - 180) < 20 || absDiff < 15) ? absDiff : 15;
          this.angle += clockWise ? - diff : diff;
          if (this.angle >= 360) {
            this.angle %= 360;
          }
          if (this.angle < 0) {
            this.angle = 360 + this.angle % 360;
          }
        }
      }
      $super(delay);
    },
    getPower: function() {
      return this.power;
    },
    getAngleByDirection: function(direction) {
      switch (direction) {
        case 0: return 90;
        case 1: return 0;
        case 2: return 270;
        case 3: return 180;
      }
    },
    getClockWiseDirection:function(currentAngle, requiredAngle) {
      var diff = requiredAngle - currentAngle;
      return !((diff > 0 && diff < 180) || (diff < -180));
    },
    move: function(direction, delay) {
      if (this.isFlying() || this.isFalling()) return;
      this.direction = direction;
      this.location = this.getNextLocation(direction);
      this.distance += this.getSpeed();

      var tile = this.getTile(this.location.clone());
      if (tile instanceof Game.Tile.Ground && tile.hasExtra()) {
        this.pickupExtra(tile.getExtra());
      }
    },
    pickupExtra: function(extra) {
      Sound.play('wow');
      extra.act(this);
      extra.remove();
    },
    kill: function() {
      if (this.dead) return;
      this.dead = true;
      this.controller.deactivate();
      this.element.addClassName('dead');
      this.element.setAttribute('title', "It's dead");
      Sound.play('die');
    },
    spawnBomb: function() {
      if (this.isFlying() || this.isFalling()) return;
      if (this.bombs.length >= this.maxBombs) return;

      var bomb = this.getTile(this.getLocation()).spawnBomb(this);
      this.bombs.push(bomb);
    },
    throwBomb: function(bomb) {
    },
    kick: function(bomb) {
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

      var tile1 = this.getTile(tileLocation1);
      var tile2 = this.getTile(tileLocation2);


      var argX, argY;
      if (tile1.isPassable() && !tile1.hasBomb()// || !tile1.getLocation().equals(this.location))
          && tile2.isPassable() && !tile2.hasBomb()) {// || !tile2.getLocation().equals(this.location))) {
        argX = mod ? 0 : - dynamicDirection * speed;
        argY = mod ? dynamicDirection * speed : 0;
        nextLocation.increase(argX, argY);
      } else {
        var dir1 = tileLocation1.getX() < nextLocation.getX() ? 3 : 1,
            dir2 = tileLocation1.getY() < nextLocation.getY() ? 0 : 2;
        var dir = mod ? dir1 : dir2;
        if (tile1.isPassable() && !tile1.hasBomb()) {// || !tile1.getLocation().equals(this.location))) {
          argX = mod ? - speed : 0;
          argY = mod ? 0 : - speed;
          nextLocation.increase(argX, argY);
          this.direction = dir;
        } else if (tile2.isPassable() && !tile2.hasBomb()) { // || !tile2.getLocation().equals(this.location))) {
          argX = mod ? speed : 0;
          argY = mod ? 0 : speed;
          nextLocation.increase(argX, argY);
          this.direction = (dir + 2) % 4;
        }
      }
      return nextLocation;
    }
  });
});
