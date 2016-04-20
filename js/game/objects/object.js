import Sound from 'babel!../../sound';

import * as objects from 'babel!../objects';
import {Scene, Actor} from 'babel!../scene';

export default class GameObject extends Actor {

  constructor(name) {
    super();
    this.name = name;
    this.triggers = [];
    this.scaleFactor = 1;
    this.flySpeed = 50;
    this.direction = 2;
  }

  set arena(arena) {
    this._arena = arena;
  }

  getElement() {
    return this.element;
  }

  snap() {
    this.location = (this.direction % 2 == 0) ? this.location.roundX() : this.location.roundY();
  }

  getSpeed() {
    return this.speed;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  increaseSpeed(speed) {
    this.speed += speed || 1;
  }

  decreaseSpeed(speed) {
    this.speed -= speed || 1;
  }

  fall() {
    if (!this.falling) {
      Sound.play('deepfall');
      this.falling = 1;
      this.element.addClassName('falling'); // todo: move to render
    } else {
      this.falling -= 0.01;
      this.scale = this.falling;
      if (this.falling <= 0) {
        if (this instanceof objects.Bomber) {
          this.controller.deactivate();
          this.dead = true;
        } else if (this instanceof objects.Bomb) {
          this.removeBomb();
        }
        if (this.element) {
          this.element.style.setProperty('display', 'none', '');
        }
      }
    }
  }

  isFalling() {
    return this.falling && this.falling > 0;
  }

  isFlying() {
    return this.destination && !this.location.equals(this.destination);
  }

  move(speed, direction) {
  }

  flyToLocation(location, callback) {
    this.destination = location;
    this.departure = this.location.clone();
    this.flyCallback = callback;
  }

  flyTo(tile, callback) {
    this.destination = tile.location;
    this.departure = this.location.clone();
    this.flyCallback = callback;
  }

  update(delay) {
    if (this.triggers != null) {
      Util.iterate(this.triggers, function (trigger) {
        trigger.check();
      });
    }
    if (this.isFalling()) {
      this.fall();
      return;
    }
    if (this.isFlying()) {
      var diff = this.flySpeed;
      var speedX = (this.destination.x - this.departure.x) / diff;
      var speedY = (this.destination.y - this.departure.y) / diff;

      if (GameObject.check(this.location.x, this.destination.x, speedX) ||
          GameObject.check(this.location.y, this.destination.y, speedY)) {

        this.location = this.destination;
        if (this.destination && this instanceof objects.Arbiter) {
          this.getTile(this.destination).vanish();
        }
        var destinationTile = this.getTile(this.destination);
        this.destination = null;
        this.departure = null;
        this.scaleFactor = 1;

        if (this.flyCallback) {
          this.flyCallback(destinationTile, this);
        }
      } else {
        this.location.x = this.location.x + speedX;
        this.location.y = this.location.y + speedY;

        var offset = Math.min(this.departure.x, this.destination.x);
        var x1 = this.departure.x - offset;
        var x2 = this.destination.x - offset;
        var x = this.location.x - offset;

        if (this.departure.x == this.destination.x) {
          offset = Math.min(this.departure.y, this.destination.y);
          x1 = this.departure.y - offset;
          x2 = this.destination.y - offset;
          x = this.location.y - offset;
        }
        var progress = x / Math.abs(x1 - x2);
        this.scaleFactor = 1 + Math.sin(progress * Math.PI) * 3;
      }
      if (!this.isFlying() && this instanceof objects.Arbiter) {
        if (this.destination) {
          var tile = this.getTile(this.destination);
          tile.vanish();
        }
      }
    }
    super.update(delay);
  }

  getTile(point) {
    return this._arena.map.getTile(point.x, point.y);
  }

  getScreen() {
    return this._arena;
  }

  static check(position, destination, diff) {
    return (Math.abs(position - destination) < Math.abs(position + diff - destination));
  }

  render(delay) {
    if (this.element) {
      if (this.location.changed) {
        this.element.style.top = (this.location.y * 40) + 'px';
        this.element.style.left = (this.location.x * 40) + 'px';
        this.location.changed = false;
      }

      if (this.scaleFactor >= 1 && this.scaleFactor != this.lastScaleFactor) {
        this.element.style.setProperty('z-index', String(Math.round((this.scaleFactor + 1) * 100)), '');
        this.element.scale(this.scaleFactor);
        this.lastScaleFactor = this.scaleFactor
      }

      if (this.isFalling()) {
        this.element.scale(this.falling);
        this.element.style.opacity = this.falling;
      }
    }
    super.render(delay);
  }

  remove() {
    if (this.element != null) {
      this.element.remove();
    }
    return this._arena.remove(this);
  }
}
