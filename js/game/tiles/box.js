import Config from 'babel!../../config';
import Sound from 'babel!../../sound';
import Tile from 'babel!./tile';
import Ground from 'babel!./ground';

export default class Box extends Tile {

  constructor(location) {
    super('box', location);
    this.shadows = Config.getProperty('graphic.shadows');
  }

  prerender(container) {
    super.prerender(container);

    if (Config.getValue('debug')) {
      this.element.stopObserving('click', this.clickHandler);

      this.element.on('mousedown', function () {
        Sound.play('crunch');
        this.destroy();
      }.bind(this));
    }
  }

  destroy() {
    // this.ground = ;
    // ground.spawnExtra(0.25);
    super.destroy(new Ground(this.location.clone()));
  }

  vanish() {
    Sound.play('crunch');
    this.destroy();
  }

  render(container) {
    if (false && this.element && this.shadows.getValue()) { // fixme: dynamic shadows
      var arbiter = this._arena.objects.arbiter;

      var ax = arbiter.location.x, ay = arbiter.location.y;

      var fi = Math.atan2((ay - this.location.y), (ax - this.location.x));

      var sx = - (Math.cos(fi) * 5);
      var sy = - (Math.sin(fi) * 5);

      this.element.style['box-shadow'] = sx + 'px ' + sy + 'px 5px black';
      this.element.style['z-index'] = 11;
    }
    super.render(container);
  }
}