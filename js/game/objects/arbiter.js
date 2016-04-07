import GameObject from 'babel!./object';
import Config from 'babel!../../config';
import Sound from 'babel!../../sound';
import Point from 'babel!../../util/point';

export default class Arbiter extends GameObject {

  constructor() {
    super('arbiter');
    this.roundtime = Config.getProperty('game.round_time').getValue();

    this.currentTime = this.roundtime - this.elapsed;
    this.hurry = false;
    this.elapsed = 0;
    this.location = new Point(-1, -1.1);
    this.running = false;
  }

  render(container) {
    if (!this.element && container) {
      this.container = container;
      this.element = new Element('div', {id: 'arbiter'}).setStyle({
        top: (this.location.y * 40) + 'px',
        left: (this.location.x * 40) + 'px'
      }).addClassName('arbiter').addClassName('object');

      this.timerElement = new Element('div', {id: 'timer'}).addClassName('object');
      this.clockElement = new Element('div', {id: 'clock'});

      if (Config.getValue('debug')) {
        this.element.observe('click', function() {
          this.running ? this.stop() : this.run();
        }.bind(this));

        this.clockElement.observe('click', function() {
          this.run();
        }.bind(this));
      }

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
          this.counterElement.update('');
        } else {
          this.counterElement.update(remaining);
        }
      }
    }
    super.render();
  }

  getRemainingTime() {
    return (this.roundtime - this.elapsed) | 0;
  }

  run() {
    if (!this.running) {
      this.elapsed = Number.MAX_VALUE;
      Sound.play('time_over');
      this.running = true;
    }
  }

  stop() {
    if (this.running) {
      this.elapsed = 0;
      this.running = false;
      this.flyToLocation(new Point(-1, -1));
    }
  }

  hurryUp() {
    this.hurry = true;
    Sound.play('hurry_up');
  }

  update(delay) {
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
      var random = this._arena.map.getRandomTile();
      if (random) {
        this.flyTo(random);
      }
    }
    super.update(delay);
  }
}