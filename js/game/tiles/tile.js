var Tile = Class.create({
  x: null,
  y: null,
  vanishing: false,
  destroyed: false,
  passable: false,
  blocking: false,
  type: -1,
  name: null,
  element: null,
  next: null,
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
    return this.vanishing;
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
  initialize: function(x, y) {
    this.x = x;
    this.y = y;
  },
  getName: function() {
    return this.name.toLowerCase();
  },
  spawnExtra: function() {},
  act: function() {},
  shake: function(shake) {
    if (shake == 0) {
      return;
    } else {
      if (shake > 0) {
        var offset = Math.round(Math.random() * 10) % 2 == 0 ? 1 : 2;
  
        var top = Math.round(Math.random() * 10) % 2 == 0 ? - offset : offset;
        var left = Math.round(Math.random() * 10) % 2 == 0 ? - offset : offset;
    
        top += this.top;
        left += this.left;
    
        this.element.setStyle({top: top + 'px', left: left + 'px'});
      } else {
        this.element.setStyle({top: this.top + 'px', left: this.left + 'px'});
      }
    }
  },
  toString: function() {
    return this.name + ' {x: ' + x + ', y: ' + y + '}';
  },
  update: function(delay, shake) {
    this.shake(shake);
  },
  render: function(container) {
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
    container.appendChild(this.element);
  }
});

Tile.prototype.toString = function() {
    return this.name;// + ' {x: ' + x + ', y: ' + y + '}';
  }; 
