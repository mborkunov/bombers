import Sound from 'babel!../../sound';
import Config from 'babel!../../config';
import * as objects from 'babel!../objects';
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

  shake(shake) {
    if (shake > 0) {
      if (Math.random() > 0) {
        var offset = Math.round(Math.random() * 10) % 2 == 0 ? 1 : 2;

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
          console.log('spawn extra');
          this.spawnExtra();
          break;
      }
    }.bind(this);

    if (Config.getValue('debug')) {
      this.element.observe('click', this.clickHandler);
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

  spawnExtra() {
    if (Math.random() > .25) {
      return;
    }
    var extras = [];

    if (Config.getProperty('diseases').getValue()) {
      if (Config.getProperty('diseases.joint').getValue()) {
        extras.push(objects.extras.Joint);
      }
      if (Config.getProperty('diseases.viagra').getValue()) {
        extras.push(objects.extras.Viagra);
      }
      if (Config.getProperty('diseases.cocaine').getValue()) {
        extras.push(objects.extras.Cocaine);
      }
    }
    if (Config.getProperty('extras.bombs').getValue()) {
      extras.push(objects.extras.Bomb);
    }
    if (Config.getProperty('extras.power').getValue()) {
      extras.push(objects.extras.Power);
    }
    if (Config.getProperty('extras.skateboard').getValue()) {
      extras.push(objects.extras.Skateboard);
    }
    if (Config.getProperty('extras.kick').getValue()) {
      extras.push(objects.extras.Kick);
    }
    if (Config.getProperty('extras.bombs').getValue()) {
      extras.push(objects.extras.Glove);
    }
    var extra = extras[Math.floor(Math.random() * extras.length)];

    this.extra = new extra(this.location.clone());
    console.log(this.extra);
    this.extra.tile = this;
    this._arena.add(this.extra);
  }

  spawnBomb(bomber) {
    var screen = this._arena;
    if (screen.hasBomb(this.getLocation())) return null;

    var bomb = new objects.Bomb(this.getLocation().clone(), bomber || screen.objects.bombers[1]);
    screen.add(bomb);
    Sound.play('putbomb');
    return bomb;
  }

  render(container) {
    if (this.nextCoordinates.x != this.currentCoordinates.x || this.nextCoordinates.y != this.currentCoordinates.y) {
      this.currentCoordinates.x = this.nextCoordinates.x;// = {x: this.element.style.left, y: this.element.style.top}
      this.currentCoordinates.y = this.nextCoordinates.y;

      this.element.style.top = this.currentCoordinates.y + 'px';
      this.element.style.left = this.currentCoordinates.x + 'px';
    }

    if (this.isVanishing()) {
      this.element.scale(this.vanishing);
      this.element.style.opacity = this.vanishing;
    }
  }

  toString() {
    return this.name + '-' + this.location.toString();
  }
}