import Sound from 'babel!../../sound';
import Config from 'babel!../../config';
import Actor from 'babel!../scene';

export default class Tile extends Actor {

  constructor(name, location) {
    super();
    this.name = name;
    this.location = location;
    this.blocking = false;
    this.destroyed = false;
    this.passable = false;
    this.currentCoordinates = location.clone();
    this.nextCoordinates = {x: this.left, y: this.top};
    this.extra = null;
  }

  set map(map) {
    this._map = map;
  }

  get map() {
    return this._map;
  }

  set arena(arena) {
    this._arena = arena;
  }

  getType() {
    return this.type;
  }

  isDestroyed() {
    return this.destroyed;
  }

  isPassable() {
    return this.passable;
  }

  isVanishing() {
    return this.vanishing !== null && this.vanishing >= 0;
  }

  getLocation() {
    return this.location;
  }

  setLocation(location) {
    this.location = location;
  }

  getName() {
    return this.name;
  }

  vanish() {
    Sound.play('crunch');
    this.vanishing = 1;
  }

  destroy() {
    if (this.next) {
      this.next._arena = this._arena;
      this.next.prerender(this.container);
    }
    this.element.hide();
    this.destroyed = true;
  }

  hasBomb() {
    return this._arena.hasBomb(this.location);
  }

  getBomb() {
    return this._arena.getBomb(this.location);
  }

  shake(epicenter) {
    if (epicenter && epicenter.near(this.location, 2.5)) {
      if (Math.random() > 0.5) {
        //var intensity = this.location.distance(epicenter);
        var offset = (Math.round(Math.random() * 10) % 2 == 0 ? 1 : 2); // intensity;

        var top = Math.round(Math.random() * 10) % 2 == 0 ? - offset : offset;
        var left = Math.round(Math.random() * 10) % 2 == 0 ? - offset : offset;

        top += this.top;
        left += this.left;

        this.nextCoordinates.y = top;
        this.nextCoordinates.x = left;
      }
    } else {
      this.nextCoordinates.y = this.top;
      this.nextCoordinates.x = this.left;
    }
  }

  prerender(container) {
    var id = 'tile-' + this.name + '-' + this.location.x + 'x' + this.location.y;
    var className = this.getName();
    this.left = this.location.x * 40;
    this.top = this.location.y * 40;

    var styles = {
      left: this.left + 'px',
      top: this.top + 'px'
    };
    this.element = new Element('div', {id: id}).addClassName('object').addClassName('tile').addClassName(className).setStyle(styles);
    this.clickHandler = function(e) {
      switch (e.button) {
        case 0:
            this.vanish();
            this.element.stopObserving('click', this.clickHandler);
        break;
        case 1:
          this.spawnBomb();
          break;
        case 2:
          this.spawnExtra(1);
          break;
      }
    }.bind(this);

    if (Config.getValue('debug')) {
      this.element.observe('mousedown', this.clickHandler);
    }
    container.appendChild(this.element);
  }

  highlight() {
    if (this.element)
      this.element.addClassName("highlight");
  }

  update(delay, shake) {
    this.shake(shake);
    if (this.isVanishing() && !this.isDestroyed()) {
      this.vanishing -= 0.01;
      if (this.vanishing <= 0) {
        this.destroy();
      }
    }
  }

  render(container) {
    if (this.nextCoordinates.x != this.currentCoordinates.x || this.nextCoordinates.y != this.currentCoordinates.y) {
      this.currentCoordinates.x = this.nextCoordinates.x;// = {x: this.element.style.left, y: this.element.style.top}
      this.currentCoordinates.y = this.nextCoordinates.y;

      this.element.style.top = this.currentCoordinates.y + 'px';
      this.element.style.left = this.currentCoordinates.x + 'px';
    }

    if (this.isVanishing() && this.element) {
      this.element.scale(this.vanishing);
      this.element.style.opacity = this.vanishing;
    }
  }

  toString() {
    return this.name + '-' + this.location.toString();
  }
}