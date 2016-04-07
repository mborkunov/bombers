import GameObject from 'babel!../object';

export default class Extra extends GameObject {

  constructor(name, location) {
    super(name);
    this.tile = null;
    this.location = location;
  }

  render() {
    if (!this.element) {
      this.element = new Element('div').setStyle({
        top: this.location.y * 40 + 'px',
        left: this.location.x * 40 + 'px'
      }).addClassName('extra').addClassName(this.name).addClassName('object');

      this.element.observe('click', function() {
        this.remove();
      }.bind(this));
      this._arena.battleField.appendChild(this.element);
    }
  }

  update(delay) {
    if (!this.isFalling()) {
      var tile = this._arena.map.getTile(this.location.x, this.location.y);
      if (tile.getName() == 'none' || tile.isDestroyed()) {
        this.fall();
      }
    }
    super.update(delay);
  }

  act() {}

  remove() {
    this._arena.remove(this);
    this.dispatch();
  }
  dispatch() {
    this.tile.extra = null;
    this.tile = null;
    this.element.remove();
  }
}