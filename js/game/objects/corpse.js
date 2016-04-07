import GameObject from 'babel!./object';

import * as tiles from 'babel!../tiles';

export default class Corpse extends GameObject {

  constructor(location, index) {
    super('corpse');
    this.location = location;
    this.index = index;
    this.flied = false;
    this.flySpeed = 30;
    this.finishTime = -1;
    this.minLifetime = 1000;
    this.lifetime = this.minLifetime + Math.floor(Math.random() * 3000);
  }

  render(container) {
    if (!this.element && container) {
      this.element = new Element('div').setStyle({
        top: (this.location.y * 40) + 'px',
        left: (this.location.x * 40) + 'px'
      }).addClassName('corpse-part').addClassName('corpse-part-' + this.index).addClassName('object');
      container.appendChild(this.element);
    }

    if (this.isFlying()) {
      this.element.style.setProperty('z-index', '200', null);
    } else {
      this.element.style.setProperty('z-index', '11', null);
    }
    super.render();
  }

  update(delay) {
    if (!this.isFlying() && !this.flied) {
      var random = this._arena.map.getRandomTileByType(tiles.Ground);
      if (random) {
        this.flied = true;
        this.flyTo(random, function() {
          this.finishTime = now();
        }.bind(this));
      }
    }
    if (this.finishTime > 0 && now() - this.finishTime > this.lifetime) {
      this.remove();
    }
    super.update(delay);
  }
}