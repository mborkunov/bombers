define('objects/explosion', ['objects/object'], function() {
  Game.Object.Explosion = Class.create(Game.Object, {
    growSpeed: null,
    size: null,
    power: null,
    beams: null,
    rendered: null,
    beamUpdateHandler: function(beam) {
      beam.update(this.delay);
    },
    initialize: function($super, location, bomber) {
      this.beams = [];
      this.rendered = false;
      this.growSpeed = .5;
      this.location = location;
      this.power = bomber.getPower();
    },
    render: function($super, container) {
      if (!this.rendered && container) {
        this.rendered = true;
        this.element = new Element('div').setStyle({
          top: (this.location.getY() * 40) + 'px',
          left: (this.location.getX() * 40) + 'px'
        }).addClassName('explosion-root').addClassName('object');
        container.appendChild(this.element);

        this.beams.push(new Game.Object.Explosion.Beam(0, this.power, this.location.clone(), container));
        this.beams.push(new Game.Object.Explosion.Beam(1, this.power, this.location.clone(), container));
        this.beams.push(new Game.Object.Explosion.Beam(2, this.power, this.location.clone(), container));
        this.beams.push(new Game.Object.Explosion.Beam(3, this.power, this.location.clone(), container));

        Util.iterate(this.beams, function(beam) {
          beam.prerender(container);
        });
      } else if (this.rendered) {
        Util.iterate(this.beams, function(beam) {
          beam.render();
        });
      }
      $super();
    },
    dispatch: function($super) {
      this.element.remove();
      for (var i = 0, length = this.beams.length; i < length; i++) {
        this.beams[i].dispatch();
      }
    },
    update: function($super, delay, map) {
      if (!this.isFlying() && !this.isFalling()) {
        this.delay = delay;
        Util.iterate(this.beams, this.beamUpdateHandler);
        var tile = map.getTile(this.location.getX(), this.location.getY());
        if (tile.getName() == 'none' || tile.isDestroyed()) {
          this.fall();
        }
      }
      $super(delay);
    }
  });

  Game.Object.Explosion.Beam = Class.create({
    direction: null,
    source: null,
    container: null,
    epicenter: null,
    names: ['north', 'east', 'south', 'west'],
    size: null,
    power: null,
    freeze: null,
    initialize: function(direction, power, epicenter, container) {
      this.epicenter = epicenter;
      this.direction = direction % 4;
      this.source = epicenter.shift(1, direction);
      this.power = power;
      this.freeze = false;
      this.growSpeed = .05;
      this.size = 0;
      this.container = container;
      this.rendered = false;
      this.screen = Game.instance.getScreen();
      this.renderedSize = 0;
      this.emptyBeam = false;
      console.log('epicenter', epicenter, 'direction', this.direction, 'source', this.source, "power - " + this.power);
    },
    update: function(delay) {
      // updating flame width
      if (this.freeze) return;
      if (this.size + 1 >= this.power) {
        this.freeze = true;
        return;
      }

      // checking source location
      if (!this.sourceChecked) {
        this.sourceChecked = true;
        var sourceTile = this.screen.map.getTile(this.source.getX(), this.source.getY());
        if (sourceTile.name == 'wall' || sourceTile.name == 'box') {
          this.size = 0;
          this.freeze = true;
          if (sourceTile.name == 'box') {
            this.emptyBeam = true;
            sourceTile.vanish();
          }
          return;
        }
      }

      var growLocation = this.getGrowLocation();
      var tile = this.screen.map.getTile(growLocation.getX(), growLocation.getY());

      switch (tile.name) {
        case 'box':
          tile.vanish();
        case 'wall':
          this.freeze = true;
        break;
        default:
            this.size++;
        break;
      }
    },
    getHeadLocation: function() {
      return this.source.shift(this.size, this.direction);
    },
    getGrowLocation: function() {
      return this.source.shift(this.size + 1, this.direction);
    },
    dispatch: function() {
      this.element.remove();
    },
    prerender: function() {
      /*this.element = new Element('div').addClassName('beam');

      this.element.setStyle({
        top: this.source.getY() * 40 + 'px',
        left: this.source.getX() * 40 + 'px'
      });
      this.element.addClassName('beam-' + this.names[this.direction]);

      this.head = new Element('div').addClassName('head');
      this.body = new Element('div').addClassName('body');
      this.element.appendChild(this.head);
      this.element.appendChild(this.body);

      this.container.appendChild(this.element);*/
    },
    render: function() {
      if (this.freeze) {
        if (this.size == 0) {
          //this.element.remove();
        }
        return;
      }

      if (!this.emptyBeam && !this.sourceElement) {
        this.sourceElement = new Element('div').setStyle({
          top: (this.source.getY() * 40) + 'px',
          left: (this.source.getX() * 40) + 'px'
        }).addClassName('explosion-root');

        this.container.appendChild(this.sourceElement);
      }

      if (this.renderedSize != this.size) {
        this.renderedSize = this.size;
        var location = this.getHeadLocation();
        this.container.appendChild(new Element('div').setStyle({
          top: (location.getY() * 40) + 'px',
          left: (location.getX() * 40) + 'px'
        }).addClassName('explosion-root'));
      }
    }
  })
});
