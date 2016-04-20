import Config from 'babel!../../config';
import Sound from 'babel!../../sound';
import Tile from 'babel!./tile';
import Ground from 'babel!./ground';

export default class Wall extends Tile {

  constructor(location) {
    super('wall', location);
    this.passable = false;
    this.blocking = true;
  }

  prerender(container) {
    this.container = container;
    super.prerender(container);

    if (Config.getValue('debug')) {
      this.element.stopObserving("click", this.clickHandler);
      this.element.on("click", function() {
        this.destroy();
        Sound.play("crunch");
      }.bind(this));
    }
  }

  destroy() {
    //this.replaceWith(new Ground(this.location.clone()));
    this.next = new Ground(this.location.clone());
    super.destroy();
  }

  vanish() {
    Sound.play('crunch');
    //this.vanishing = -1;
    this.destroy();
  }

  render(container) {
    super.render(container);
  }
}