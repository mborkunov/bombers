define('objects/arbiter', ['objects/object'], function() {
  Game.Object.Arbiter = Class.create(Game.Object, {
    running: null,
    roundtime: null,
    elapsed: null,
    hurry: null,
    initialize: function($super) {
      $super();
      this.roundtime = Config.getProperty('game.round_time').getValue();

      this.currentTime = this.roundtime - this.elapsed;
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

        this.timerElement = new Element('div', {id: 'timer'});
        this.clockElement = new Element('div', {id: 'clock'});
        this.clockElement.observe('click', function() {
          this.run();
        }.bind(this));

        this.counterElement = new Element('div', {id: 'counter'}).update(this.getRemainingTime());
        this.timerElement.appendChild(this.clockElement);
        this.timerElement.appendChild(this.counterElement);
        container.appendChild(this.timerElement);
        container.appendChild(this.element);
      } else {
        var remaining = this.getRemainingTime();
        if (this.currentTime != remaining) {
          this.currentTime = remaining;
          if (remaining == 0) {
            this.clockElement.addClassName('expired');
            this.counterElement.update(':)');
          } else {
            this.counterElement.update(remaining);
          }
        }
      }
      $super();
    },
    getRemainingTime: function() {
      return (this.roundtime - this.elapsed) | 0;
    },
    run: function() {
      if (!this.running) {
        this.elapsed = Number.MAX_VALUE;
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
        this.elapsed += delay / 1000;
        if (!this.hurry && Math.abs(this.roundtime - this.elapsed) <= 15) {
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
