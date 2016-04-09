import GameObject from 'babel!./object';
import Trigger from 'babel!../../util/trigger';

import * as tiles from 'babel!../tiles';

export default class Explosion extends GameObject {

  constructor(location, bomber) {
    super('explosion');
    this.lifetime = 500;
    this.location = location;
    this.power = bomber.getPower();
    this.rendered = false;
    this.start = now();
    this.triggers.push(
      new Trigger(function () {
          return now() - this.start > this.lifetime / 6;
        }.bind(this),
        function () {
          this.element.removeClassName('small').addClassName('medium');
        }.bind(this)
      ));
    this.triggers.push(
      new Trigger(function () {
          return now() - this.start > this.lifetime - this.lifetime / 3;
        }.bind(this),
        function () {
          this.element.removeClassName('medium').addClassName('big');
        }.bind(this)
      ));
    this.triggers.push(
      new Trigger(function () {
          return now() - this.start > this.lifetime - this.lifetime / 6;
        }.bind(this),
        function () {
          this.element.removeClassName('big').addClassName('medium');
        }.bind(this)
      ));
    this.triggers.push(
      new Trigger(function () {
          return now() - this.start > this.lifetime - this.lifetime / 8;
        }.bind(this),
        function () {
          this.element.removeClassName('medium').addClassName('small');
        }.bind(this)
      ));

    this.triggers.push(
      new Trigger(function () {
          return now() - this.start > this.lifetime;
        }.bind(this),
        function () {
          this.dispatch();
        }.bind(this)
      ));
  }

  render(container) {
    if (!this.rendered && container) {
      this.rendered = true;
      this.element = new Element('div').setStyle({
        top: (this.location.y * 40) + 'px',
        left: (this.location.x * 40) + 'px'
      }).addClassName('explosion small').addClassName('object');

      this.element.insert('<div class="epicenter"></div>');

      ['north', 'west', 'south', 'east'].each(function (dir, index) {
        var beam = new Element('div');
        beam.addClassName('beam ' + dir);
        if (index < 2) {
          beam.insert('<div class="edge"></div><div class="body"></div>');
        } else {
          beam.insert('<div class="body"></div><div class="edge"></div>');
        }

        this.element.appendChild(beam);
      }.bind(this));

      container.appendChild(this.element);

      var power = this.power - 1;

      var size = (power * 80 + 120);
      this.element.style.width = size + 'px';
      this.element.style.height = size + 'px';
      this.element.style.marginTop = -size / 2 + 20 + 'px';
      this.element.style.marginLeft = -size / 2 + 20 + 'px';

      this.element.select('.body').each(function (beamBody) {
        var attribute = beamBody.parentNode.getAttribute('class');
        if (attribute.indexOf('west') > -1 || attribute.indexOf('east') > -1) {
          beamBody.style.width = (power * 40) + 'px';
        } else {
          beamBody.style.height = (power * 40) + 'px';
        }
      }.bind(this));

      var cssClasses = ['north', 'east', 'south', 'west'];
      for (var i = 0; i < 4; i++) {
        var barrier;
        if ((barrier = this.findIntersection(i)) != null) {
          var tile = barrier[0];
          var offset = barrier[1];
          if (tile instanceof tiles.Ground) {
            if (tile.hasExtra()) {
              tile.getExtra().remove();
            } else if (tile.hasBomb()) {
              tile.getBomb().explode();
              this.element.select('.' + cssClasses[i] + ' >.edge').invoke('hide');
            }
          } else if (tile instanceof tiles.Box) {
            tile.destroy();
            if (tile.next.hasExtra()) {
              this.element.select('.' + cssClasses[i] + ' >.edge').invoke('hide');
            }
          } else if (tile instanceof tiles.Wall) {
            this.element.select('.' + cssClasses[i] + ' >.edge').invoke('hide');
          }
          if (offset == 1) {
            this.element.select('.' + cssClasses[i] + ' >.body').invoke('hide');
          } else if (offset > 1) {
            var diff = offset - 1;
            this.element.select('.' + cssClasses[i] + ' >.body').each(function (body) {
              if (i == 0 || i == 2) {
                body.style.height = diff * 40 + 'px';
              } else {
                body.style.width = diff * 40 + 'px';
              }
            });
          }
        }
      }
      this.killBombers(this.location);
      this.element.observe('click', this.dispatch.bind(this));
    }
    super.render();
  }

  findIntersection(direction) {
    var i = 0;
    var location = this.location.clone();
    while (++i <= this.power) {
      switch (direction) {
        case 0:
          location.increaseY(-1);
          break;
        case 1:
          location.increaseX(1);
          break;
        case 2:
          location.increaseY(1);
          break;
        case 3:
          location.increaseX(-1);
          break;
      }
      var tile = this.getTile(location);
      if (!tile.isPassable() ||
        (tile instanceof tiles.Ground && (tile.hasExtra() || tile.hasBomb()))) {
        return [tile, i];
      }
      this.killBombers(location);
    }
    return null;
  }

  killBombers(location) {
    var bombers = this._arena.objects.bombers;
    Util.iterate(bombers, function (bomber) {
      if (bomber.isFalling()) return;
      if (bomber.getLocation().round().equals(location)) {
        bomber.isDead() ? bomber.blow() : bomber.kill();
      }
    });
  }

  dispatch() {
    this.element.remove();
    this._arena.remove(this);
  }

  update(delay) {
    super.update(delay);
  }
}
