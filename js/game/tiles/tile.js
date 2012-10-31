define('tiles/tile', [], function() {
  Game.Tile = Class.create({
    location: null,
    vanishing: null,
    destroyed: false,
    passable: null,
    blocking: false,
    type: -1,
    name: null,
    element: null,
    next: null,
    currentCoordinates: null,
    nextCoordinates: null,
    initialize: function(location) {
      this.passable = false;
      this.location = location;
      this.currentCoordinates = {x: location.getX(), y: location.getY()};
      this.nextCoordinates = {x: this.left, y: this.top};
      this.extra = null;
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
    hasBomb: function() {
      return Game.instance.getScreen().hasBomb(this.location);
    },
    getBomb: function() {
      return Game.instance.getScreen().getBomb(this.location);
    },
    shake: function(shake) {
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
    },
    prerender: function(container) {
      var id = 'tile-' + this.name + '-' + this.location.getX() + 'x' + this.location.getY();
      var className = this.getName();
      this.left = this.location.getX() * 40;
      this.top = this.location.getY() * 40;

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
        }
      }.bind(this);

      if (Config.getValue('debug')) {
        this.element.observe('click', this.clickHandler);
      }
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
    spawnExtra: function() {
      var screen = Game.instance.getScreen();
      var extra = null;

      switch (Math.floor(Math.random() * 1) + 5) {
        case 0:
            extra = Game.Object.Extra.Bomb;
          break;
        case 1:
            extra = Game.Object.Extra.Cocaine;
          break;
        case 2:
            extra = Game.Object.Extra.Glove;
          break;
        case 3:
            extra = Game.Object.Extra.Joint;
          break;
        case 4:
            extra = Game.Object.Extra.Kick;
          break;
        case 5:
            extra = Game.Object.Extra.Power;
          break;
        case 6:
            extra = Game.Object.Extra.Skateboard;
          break;
        case 7:
            extra = Game.Object.Extra.Viagra;
          break;
      }
      if (Math.random() > .5) {
        extra = null;
      }

      if (extra) {
        this.extra = new extra(this.location.clone());
        this.extra.tile = this;
        screen.add(this.extra);
      }
    },
    spawnBomb: function(bomber) {
      var screen = Game.instance.getScreen();
      if (screen.hasBomb(this.getLocation())) return null;

      var bomb = new Game.Object.Bomb(this.getLocation().clone(), bomber || screen.objects.bombers[1]);
      screen.add(bomb);
      Sound.play('putbomb');
      return bomb;
    },
    render: function(container) {
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
    },
    toString: function() {
      return this.name + '-' + this.location.toString();
    }
  });

  Game.Tile.prototype.toString = function() {
    return this.name;
  };
});
