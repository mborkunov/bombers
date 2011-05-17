define('tiles/tile', [], function() {
  Game.Tile = Class.create({
    location: null,
    vanishing: null,
    destroyed: false,
    passable: false,
    blocking: false,
    type: -1,
    name: null,
    element: null,
    next: null,

    initialize: function(location) {
      this.location = location;
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
    isFallen: function() {
      return this.vanishing == 0;
    },
    isVanishing: function() {
      return this.vanishing !== null && this.vanishing >= 0;
    },
    getLocation: function() {
      return this.location;
    },
    setLocation: function(location) {
      this.location = location;
    },
    getName: function() {
      return this.name.toLowerCase();
    },
    spawnExtra: function() {
    },
    act: function() {
    },
    vanish: function() {
      Sound.play('crunch');
      this.vanishing = 1;
    },
    destroy: function() {
      if (this.next) {
        this.next.prerender(this.container);
      }
      this.element.hide();
      this.destroyed = true;
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
      var id = 'tile-' + this.name + '-' + this.location.getX() + 'x' + this.location.getY();
      var className = 'tile-' + this.getName();
      this.left = this.location.getX() * 40;
      this.top = this.location.getY() * 40;

      var styles = {
        left: this.left + 'px',
        top: this.top + 'px'
      };
      this.element = new Element('div', {id: id}).addClassName('tile').addClassName(className).setStyle(styles);
      this.clickHandler = function() {
        this.vanish();
        this.element.stopObserving("click", this.clickHandler);
      }.bind(this);
      this.element.observe('click', this.clickHandler);
      container.appendChild(this.element);
    },
    highlight: function() {
      if (this.element)
        this.element.addClassName("highlight");
    },
    update: function(delay, shake) {
      this.shake(shake);
      if (this.isVanishing() && !this.isDestroyed()) {
        this.vanishing -= 0.01;
        if (this.vanishing <= 0) {
          this.destroy();
        }
      }
    },
    render: function(container) {
      var top = this.element.y + 'px';
      var left = this.element.x + 'px';

      if (this.element.style.top != top || this.element.style.left != left) {
        this.element.style.top = top;
        this.element.style.left = left;
      }

      if (this.isVanishing()) {
        this.element.style['-webkit-transform'] = 'scale(' + this.vanishing + ', ' + this.vanishing + ')';
        this.element.style.MozTransform = 'scale(' + this.vanishing + ', ' + this.vanishing + ')';
        this.element.style.opacity = this.vanishing;
      }
    },
    toString: function() {
      return this.name + '-' + location.toString();
    }
  });

  Game.Tile.prototype.toString = function() {
    return this.name;
  };
});
