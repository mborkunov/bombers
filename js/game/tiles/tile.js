var Tile = Class.create({
  x: null,
  y: null,
  vanishing: null,
  destroyed: false,
  passable: false,
  blocking: false,
  type: -1,
  name: null,
  element: null,
  next: null,

  initialize: function(x, y) {
    this.x = x;
    this.y = y;
  },
  getType: function() {
    return this.type;
  },
  isDestroyed: function() {
    return this.destroyed;
  },
  isPassable: function() {
    return this.passable;
  },
  isBlocking: function() {
    return this.blocking;
  },
  isVanishing: function() {
    return this.vanishing !== null && this.vanishing >= 0;
  },
  getX: function() {
    return this.x;
  },
  getY: function() {
    return this.y;
  },
  setPosition: function(x, y) {
    this.x = x;
    this.y = y;
  },
  getName: function() {
    return this.name.toLowerCase();
  },
  spawnExtra: function() {},
  act: function() {},
  update: function(delay, shake) {
    this.shake(shake);
    if (this.isVanishing() && !this.isDestroyed()) {
      this.vanishing -= 0.01;
      if (this.vanishing <= 0) {
        this.destroy();
      }
    }
  },
  vanish: function() {
    console.log('vanish: ' + this.getName());
    this.vanishing = 1;
  },
  destroy: function() {
    console.log("destroy: " + this.getName());
    if (this.next) {
      this.next.prerender(this.container);
    }
    this.element.hide();
  },
  shake: function(shake) {
    if (shake == 0) {
      return null;
    } else {
      if (shake > 0) {
        var offset = Math.round(Math.random() * 10) % 2 == 0 ? 2 : 1;

        var top = Math.round(Math.random() * 10) % 2 == 0 ? - offset : offset;
        var left = Math.round(Math.random() * 10) % 2 == 0 ? - offset : offset;

        top += this.top;
        left += this.left;

        this.element.y = top;
        this.element.x = left;
      } else {
        this.element.y = this.top;
        this.element.x = this.left;
      }
    }
  },
  prerender: function(container) {
    var id = 'tile-' + this.name + '-' + this.x + 'x' + this.y;
    var className = 'tile-' + this.getName();
    this.left = this.y * 40;
    this.top = this.x * 40;

    var styles = {
      position: 'absolute',
      left: this.left + 'px',
      top: this.top + 'px',
      width: '40px', height: '40px'
    };
    this.element = new Element('div', {id: id}).addClassName('tile').addClassName(className).setStyle(styles);
    this.clickHandler = function() {
      this.vanish();
    }.bind(this);
    this.element.observe("click", this.clickHandler);
    container.appendChild(this.element);
  },
  render: function(container) {
    var top = this.element.y + 'px'
    var left = this.element.x + 'px'

    if (this.element.style.top != top || this.element.style.left != left) {
      this.element.style.top = top;
      this.element.style.left = left;
    }

    if (this.vanishing !== null && this.vanishing >= 0) {
      this.element.style["-webkit-transform"] = "scale(" + this.vanishing + ", " + this.vanishing +")";
      this.element.style.opacity = this.vanishing;
    }
  },
  toString: function() {
    return this.name + ' {x: ' + this.x + ', y: ' + this.y + '}';
  }
});

Tile.prototype.toString = function() {
  return this.name;
};
