import GameObject from 'babel!./object';
import CorpsePart from 'babel!./corpse';
import Config from 'babel!../../config';
import Sound from 'babel!../../sound';

import * as tiles from 'babel!../tiles';
import * as extras from 'babel!./extras';

export default class Bomber extends GameObject {

  constructor(controller, number, location, config) {
    super('bomber');
    //this.backgroundPosition = {x: 0, y: 0};
    this.bombs = 0;
    this.distance = 0;
    this.rollingAngle = 0;
    this.rollAngle = 0;
    this.angle = 0;
    this.rollAngle = 0;
    this.dead = false;
    this.blown = false;
    this.location = location;
    this.number = number;
    this.config = config;

    this.speed = .05 + Config.getValue('start.skateboards') * extras.Skateboard.getSpeed();
    this.maxBombs = Config.getValue('start.bombs');
    this.power    = Config.getValue('start.power');
    this.canKick  = Config.getValue('start.kick');
    this.canThrow = Config.getValue('start.glove');

    controller.attach(this);
    this.controller = controller;
  }

  isDead() {
    return this.dead;
  }

  render(container) {
    if (!this.element && container) {
      this.element = new Element('div').setStyle({
        top: (this.location.y * 40) + 'px',
        left: (this.location.x * 40) + 'px'
      }).addClassName('object').addClassName('bomber').addClassName('bomber-' + this.number);
      this.element.setAttribute('title', this.config['username']);
      this.element.setStyle({'background-color': this.config['color']});
      this.eyes = new Element('div').addClassName('eyes object').addClassName(this.config['eyes']);
      this.element.appendChild(this.eyes);
      if (Config.getValue('debug')) {
        this.element.observe('click', function() {
          this.isDead() ? this.blow() : this.kill();
        }.bind(this));
      }
      container.appendChild(this.element);
    }

    if (this.isFlying()) {
      this.element.style.setProperty('z-index', '200', '');
    } else {
      var zIndex = String(Math.round(Math.abs(this.location.y + 0) * 10) + 11);
      this.element.style.setProperty('z-index', zIndex, '');
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
    super.render();
  }

  update(delay) {
    if (!this.isFlying()) {
      if (!this.isFalling()) {
        var tile = this._arena.map.getTile(this.location.x, this.location.y);
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
    super.update(delay);
  }

  getPower() {
    return this.power;
  }

  getAngleByDirection(direction) {
    switch (direction) {
      case 0: return 90;
      case 1: return 0;
      case 2: return 270;
      case 3: return 180;
    }
    return -1;
  }

  getClockWiseDirection(currentAngle, requiredAngle) {
    var diff = requiredAngle - currentAngle;
    return !((diff > 0 && diff < 180) || (diff < -180));
  }

  move(direction, delay) {
    if (this.isFlying() || this.isFalling()) return;
    this.direction = direction;
    this.location = this.getNextLocation(direction);
    this.distance += this.getSpeed();

    var tile = this.getTile(this.location.clone());
    if (tile instanceof tiles.Ground && tile.hasExtra()) {
      this.pickupExtra(tile.getExtra());
    }
  }

  pickupExtra(extra) {
    Sound.play('wow');
    extra.act(this);
    extra.remove();
  }

  kill() {
    this.dead = true;
    this.controller.deactivate();
    this.element.addClassName('dead');
    this.element.setAttribute('title', "It's dead");
    Sound.play('die');
  }

  blow() {
    if (this.blown) {
      return;
    }
    this.blown = true;
    this.element.remove();

    for (var i = 0; i < Math.ceil(Math.random() * 2) + 2; i++) {
      this._arena.add(new CorpsePart(this.getLocation().clone(), i + 1));
    }
    Sound.play('corpse_explode');
  }

  spawnBomb() {
    if (this.isFlying() || this.isFalling()) return;
    if (this.bombs >= this.maxBombs) return;
    if (this.getTile(this.getLocation()).spawnBomb(this)) {
      this.bombs++;
    }
  }

  throwBomb(bomb) {
  }

  kick(bomb) {
  }

  getNextLocation(direction) {
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
      var dir1 = tileLocation1.x < nextLocation.x ? 3 : 1,
          dir2 = tileLocation1.y < nextLocation.y ? 0 : 2;
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
}