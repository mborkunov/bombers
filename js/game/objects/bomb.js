import GameObject from 'babel!./object';
import Explosion from 'babel!./explosion';
import Sound from 'babel!../../sound';
import Trigger from 'babel!../../util/trigger';

export default class Bomb extends GameObject {

  constructor(location, bomber) {
    super('bomb');
    this.lifetime = 3000;
    this.backgroundPosition = {x: 0, y: 0};
    this.bomber = bomber;
    this.distance = 0;
    this.speed = .05;
    this.power = bomber.getPower();
    this.location = location;
    this.scale = 1;
    this.scaleCounter = 0;
    this.lastUpdate = 0;
    this.start = now();
    this.triggers.push(
      new Trigger(function() {
        return now() - this.start > this.lifetime && !(this.isFlying() || this.isFalling());
      }.bind(this),
        function() {
          this.explode();
        }.bind(this)
    ));
  }

  render(container) {
    if (!this.element && container) {
      this.element = new Element('div').setStyle({
        top: (this.location.y * 40) + 'px',
        left: (this.location.x * 40) + 'px'
      }).addClassName('bomb').addClassName('object');
      this.element.observe('click', this.explode.bind(this));
      container.appendChild(this.element);
    }

    if (this.isFlying()) {
      this.element.style.setProperty('z-index', '200', '');
    } else {
      this.element.style.setProperty('z-index', String((Math.round(Math.abs(this.location.y + 0) * 10) + 11)), '');
      this.element.scale(this.scale, this.scale);
    }
    super.render();
  }

  dispatch() {
  }

  update(delay) {
    if (!this.isFlying() && !this.isFalling()) {
      var tile = this._arena.map.getTile(this.location.x, this.location.y);
      if (tile.getName() == 'none' || tile.isDestroyed()) {
        this.fall();
      }
      var time = now();
      if (time - this.lastUpdate > 10) {
        this.lastUpdate = time;
        this.scale = 1 + Math.abs(Math.sin(this.scaleCounter+=3 * Math.PI / 180)) / 7;
      }
    }
    super.update(delay);
  }

  move(direction, delay) {
    if (this.isFlying() || this.isFalling()) return;
    this.location = this.getNextLocation(direction);
    this.distance += this.getSpeed();
  }

  removeBomb() {
    this.element.remove();
    this._arena.remove(this);
  }

  explode() {
    this._arena.add(new Explosion(this.location.clone().round(), this.bomber));
    this.removeBomb();
    this.bomber.bombs--;
    this._arena.shakeIt();
    Sound.play('explode');
  }
}