define('objects/explosion', ['objects/object'], function() {
  Game.Object.Explosion = Class.create(Game.Object, {
    growSpeed: null,
    size: null,
    power: null,
    beams: null,
    rendered: null,
    initialize: function($super, location) {
      this.beams = [];
      this.rendered = false;
      this.growSpeed = .5;
      this.location = location;
    },
    render: function($super, container) {
      if (!this.rendered && container) {
        this.rendered = true;
        this.element = new Element('div').setStyle({
          top: (this.location.getY() * 40) + 'px',
          left: (this.location.getX() * 40) + 'px'
        }).addClassName('explosion');
        container.appendChild(this.element);

        this.beams.push(new Game.Object.Explosion.Beam(0, 5, location.clone()), container);
        this.beams.push(new Game.Object.Explosion.Beam(1, 5, location.clone()), container);
        this.beams.push(new Game.Object.Explosion.Beam(2, 5, location.clone()), container);
        this.beams.push(new Game.Object.Explosion.Beam(3, 5, location.clone()), container);
      } else if (this.rendered) {
        for (var i = 0, length = this.beams.length; i < length; i++) {
          this.beams[i].render();
        }

        this.location.increaseY(-0.01);

        this.element.style.top = (this.location.getY() * 40) + 'px';
        this.element.style.height = (parseInt(this.element.style.height) + 2) + 'px';
      }
      $super();
    },
    dispatch: function($super) {
      for (var i = 0, length = this.beams.length; i < length; i++) {
        this.beams[i].dispatch();
      }
    },
    update: function($super, delay, map) {
      if (!this.isFlying() && !this.isFalling()) {
        var tile = map.getTile(this.location.getX(), this.location.getY());
        if (tile.getName() == 'none' || tile.isDestroyed()) {
          this.fall();
        }
      }
      for (var i = 0, length = this.beams.length; i < length; i++) {
        this.beams[i].dispatch();
      }
      $super(delay);
    }
  });


  Game.Object.Explosion.Beam = Class.create({
    direction: null,
    power: null,
    root: null,
    container: null,
    rendered: false,
    beamElement: null,
    initialize: function(direction, power, root, container) {
      this.root = root;
      this.direction = direction;
      this.power = power;
      this.container = container;
      this.rendered = false;
    },
    update: function(delay) {
    },
    render: function() {
      if (!this.rendered) {
        this.rendered = true;
        this.beamElement = new Element('div').addClassName('beam');
        this.container.appendChild(this.beamElement);
      } else {
      }
    }
  })
});
