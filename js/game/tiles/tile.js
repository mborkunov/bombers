import Config from 'babel!../../config';
import Actor from 'babel!../scene';

export default class Tile extends Actor {

  constructor(name, location) {
    super();
    this.name = name;
    this.element = null;
    this.location = location;
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

  destroy(newTile) {
    if (newTile && newTile instanceof Tile) {
      newTile._arena = this._arena;
      console.log(newTile);
      newTile.prerender(this.container);
      this.next = newTile;
    }
    this.element.hide();
    this.destroyed = true;
  }

  canPass() {
    return this.passable;
  }

  shake(quakes) {
    if (quakes.length) {
      for (var i  = 0, length = quakes.length; i < length; i++) {
        var quake = quakes[i];
        if (quake && quake[0].near(this.location, quake[1])) {
          if (Math.random() > 0.5) {
            // var intensity = this.location.distance(epicenter);
            var offset = (Math.round(Math.random() * 10) % 2 == 0 ? 1 : 2); // intensity;

            var yOffset = Math.round(Math.random() * 10) % 2 == 0 ? - offset : offset;
            var xOffset = Math.round(Math.random() * 10) % 2 == 0 ? - offset : offset;

            this.nextCoordinates.y = this.top  + yOffset;
            this.nextCoordinates.x = this.left + xOffset;
          }
        }
      }
    } else {
      this.nextCoordinates.y = this.top;
      this.nextCoordinates.x = this.left;
    }
  }

  prerender(container) {
    this.container = container;
    var id = 'tile-' + this.name + '-' + this.location.x + 'x' + this.location.y;
    var className = this.name;
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
          this.element.stopObserving('click', this.clickHandler);
          this.vanish();
        break;
        case 1:
          this.spawnBomb();
          break;
        case 2:
          this.spawnExtra(1);
          break;
      }
    }.bind(this);

    Config.getProperty('debug').addListener(function(debug) {
      if (debug) {
        this.element.observe('mousedown', this.clickHandler);
      } else {
        this.element.stopObserving('mousedown', this.clickHandler);
      }
    }.bind(this));
    container.appendChild(this.element);
  }

  highlight() {
    if (this.element)
      this.element.addClassName("highlight");
  }

  update(delay, quakes) {
    this.shake(quakes);
    if (this.vanishing && !this.destroyed) {
      /*this.vanishing -= 0.01;
      if (this.vanishing <= 0) {
        this.destroy();
      }*/
    }
  }

  render(container) {
    if (this.nextCoordinates.x != this.currentCoordinates.x || this.nextCoordinates.y != this.currentCoordinates.y) {
      this.currentCoordinates.x = this.nextCoordinates.x;// = {x: this.element.style.left, y: this.element.style.top}
      this.currentCoordinates.y = this.nextCoordinates.y;

      this.element.style.top = this.currentCoordinates.y + 'px';
      this.element.style.left = this.currentCoordinates.x + 'px';
    }
  }

  toString() {
    return this.name + '-' + this.location.toString();
  }
}