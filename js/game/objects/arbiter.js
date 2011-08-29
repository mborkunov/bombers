define('objects/arbiter', ['objects/object'], function() {
  Game.Object.Arbiter = Class.create(Game.Object, {
    running: null,
    roundtime: null,
    elapsed: null,
    hurry: null,
    initialize: function($super) {
      $super();
      this.roundtime = Config.get('game.round_time') * 1000;
      this.hurry = false;
      this.elapsed = 0;
      this.location = new Point(-1, -1.1);
      this.running = false;
    },
    render: function($super, container) {
      if (!this.element && container) {
        this.container = container;
        this.element = new Element('div', {id: 'arbiter'}).setStyle({
          top: (this.location.getY() * 40) + 'px',
          left: (this.location.getX() * 40) + 'px'
        }).addClassName('arbiter');

        this.element.observe('click', function() {
          this.run();
        }.bind(this));

        container.appendChild(this.element);
      }
      $super();
    },
    isRunning: function() {
      return this.running;
    },
    run: function() {
      if (!this.running) {
        Sound.play('time_over');
        this.running = true;
      }
    },
    hurryUp: function() {
      this.hurry = true;
      Sound.play('hurry_up');
    },
    update: function($super, delay, map) {
      if (this.roundtime <= 0) {
        return;
      }
      if (!this.running) {
        this.elapsed += delay;
        if (!this.hurry && Math.abs(this.roundtime - this.elapsed) <= 15000) {
          this.hurryUp();
        }
        if (this.elapsed >= this.roundtime) {
          this.run();
        }
      } else if (!this.isFlying()) {
        var random = map.getRandomTile();
        if (random) {
          this.flyTo(random);
        }
      }
      $super();
    }
  });
});
