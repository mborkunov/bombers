import Screen from 'babel!./screen';
import Menu from 'babel!./menu';
import Config from 'babel!../../config';
import * as objects from 'babel!../objects';
import * as tiles from 'babel!../tiles';
import AiController from 'babel!../controllers/ai';
import KeyboardController from 'babel!../controllers/keyboard';
import Point from 'babel!../../util/point';

export default class Arena extends Screen {

  constructor(container, callback) {
    super('arena', container);
    this.callback = callback;
    this.checkBomberFilter = function(bomber) {return !bomber.isDead()};
    this.objects = {
      bombers: [],
      corpses: [],
      bombs: [],
      explosions: [],
      arbiter: null,
      extras: [],
      each: function(call) {
        Util.iterate(this.bombers, call);
        Util.iterate(this.bombs, call);
        Util.iterate(this.extras, call);
        Util.iterate(this.explosions, call);
        Util.iterate(this.corpses, call);

        call(this.arbiter);
      }
    };

    this.add(new objects.Arbiter());
    this.paused = false;
    this.shakyExplosions = Config.getProperty('graphic.shaky_explosions');
    this.shake = 0;
    this.listeners = {
      mousemove: function(e) {
        this.mouse = e;
      }.bind(this),
      keydown: function(e) {
        if (this.keys.indexOf(e.keyCode) === -1) {
          this.keys.push(e.keyCode);
        }
        if (e.keyCode == 83 && e.hasModifiers()) {
          if (Config.change('graphic.shadows')) {
            container.addClassName('shadows');
          } else {
            container.removeClassName('shadows');
          }
        }
      }.bind(this),
      keyup: function(e) {
        if (this.keys.indexOf(e.keyCode) !== -1) {
          this.keys = this.keys.without(e.keyCode);
        }

        if (e.keyCode == 27 || e.keyCode == 19) {
          this.paused = !this.paused;
        }
      }.bind(this)
    };
    this.updateObjectsHandler = function(object) {
      try {
        var delay = 20;
        if (object instanceof objects.Bomber) {
          object.controller.update(this.keys, delay);
        }
        object.update(delay);
      } catch (e) {
        console.error(e, object);
      }
    }.bind(this);
    this.renderObjectsHandler = function(item) {
      try {
        item.render(this.battleField);
      } catch (e) {
        console.error(e);
      }
    }.bind(this);

    tiles.Map.getNextMap(function(map) {
      this.map = map;
      this.map.entry.each(function(tile) {
        tile.arena = this;
        tile.map = map;
      }.bind(this));

      var players = Config.Players.getActivePlayers();
      var positions = this.map.getPlayerStartupPositions();


      var x = this.map.entry.size.x - 1, y = this.map.entry.size.y - 1;
      var defaultLocation = new Point(Math.floor(x / 2), Math.floor(y / 2));
      for (var i = 0, length = positions.length; i < length; i++) {
        var player = players[i];

        var controller;
        switch (player.getValue('controller')) {
          case 'ai':
            controller = new AiController();
            break;
          default:
            var type = KeyboardController.Type[player.getValue('controller').toUpperCase()];
            controller = new KeyboardController(type);
            break;
        }
        var position = positions[i % positions.length];
        var bomber = new objects.Bomber(controller, i + 1, defaultLocation.clone(), player.getConfig());
        bomber.flyTo(this.map.entry.tiles[position.point.x][position.point.y]);
        this.add(bomber);
      }
      this.prerender();
    }.bind(this));
  }

  /**
   * @param {GameObject} object
   */
  add(object) {
    if (object instanceof objects.Bomb) {
      this.objects.bombs.push(object);
    } else if (object instanceof objects.Explosion) {
      this.objects.explosions.push(object);
    } else if (object instanceof objects.extras.Extra) {
      this.objects.extras.push(object);
    } else if (object instanceof objects.Corpse) {
      this.objects.corpses.push(object);
    } else if (object instanceof objects.Bomber) {
      this.objects.bombers.push(object);
    } else if (object instanceof objects.Arbiter) {
      this.objects.arbiter = object;
    }
    object.arena = this;
  }

  /**
   * @param {GameObject} object
   */
  remove(object) {
    if (object instanceof objects.Bomber) {
      this.objects.bombers = this.objects.bombers.without(object);
    } else if (object instanceof objects.extras.Extra) {
      this.objects.extras = this.objects.extras.without(object);
    } else if (object instanceof objects.Explosion) {
      this.objects.explosions = this.objects.explosions.without(object);
    } else if (object instanceof objects.Bomb) {
      this.objects.bombs = this.objects.bombs.without(object);
    } else if (object instanceof objects.Corpse) {
      this.objects.corpses = this.objects.corpses.without(object);
    }
    object.arena = null;
  }

  hasBomb(location) {
    return this.getBomb(location) != null;
  }

  getBomb(location) {
    for (var i = 0; i < this.objects.bombs.length; i++) {
      var bomb = this.objects.bombs[i];
      if (bomb.getLocation().equals(location)) {
        return bomb;
      }
    }
    return null;
  }

  prerender() {
    this.rendered = true;

    this.battleField = new Element('div', {id: 'field'}).setStyle({position: 'relative'}).addClassName('field');
    this.map.prerender(this.battleField);
    this.container.appendChild(this.battleField);

    this.battleField.appendChild(new Element('div', {id: 'logo'}).addClassName('object').observe('click', function() {
      this.paused = true;
    }.bind(this)));

    this.objects.each(function(object) {
      try {
        object.render(this.battleField);
      } catch (e) {
        console.error(e);
      }
    }.bind(this));
  }

  killBombers() {
    if (!this.scoreScreenTimeout && this.objects.bombers.filter(this.checkBomberFilter).length == 0) {
      this.scoreScreenTimeout = setTimeout(function() {
        this.callback(Arena);
      }.bind(this), 1000);
    }
  }

  update(delay) {
    if (this.map == null) return;
    if (this.paused) return;
    if (Config.getValue('debug') && this.keys.indexOf(Event.KEY_HOME) != -1) {
      this.shakeIt();
    }

    this.objects.each(this.updateObjectsHandler);
    this.map.update(delay, this.shake);
    this.killBombers();
  }

  shakeIt() {
    if (!this.shakyExplosions.getValue()) return;
    if (!Object.isUndefined(this.timeout)) {
      clearTimeout(this.timeout);
    }
    this.shake = 1;
    this.timeout = setTimeout(function() {
      this.shake = -1;
    }.bind(this), 300);
  }

  render(time) {
    if (!this.rendered) return;
    if (!this.paused) {
      this.map.render(this.battleField);
      this.objects.each(this.renderObjectsHandler);
    }

    if (this.paused && !this.dialog) {
      $('field').addClassName('filter');
      this.overlay = new Element('div', {id: 'arena-overlay'});
      this.overlay.observe('click', function(e) {
        e.element().remove()
      });
      this.dialog = new Element('div').addClassName('dialog');
      this.dialog.appendChild(new Element('a').addClassName('action').update('Abort ').observe('click', function() {
        this.callback(Menu);
      }.bind(this)));
      this.dialog.appendChild(new Element('a').addClassName('action').update('Resume').observe('click', function() {
        this.paused = false;
      }.bind(this)));
      this.container.appendChild(this.overlay);
      this.container.appendChild(this.dialog);
    } else if (!this.paused && this.dialog) {
      $('field').removeClassName('filter');
      this.dialog.remove();
      try {
        this.overlay.remove();
      } catch (ignored) {}
      this.overlay = this.dialog = null;
    }
  }

  dispatch() {
    this.rendered = false;
    try {
      this.container.removeChild(this.battleField);
      if (this.overlay) {
        this.container.removeChild(this.dialog);
        try {
          this.container.removeChild(this.overlay);
        } catch (ignored) {}
      }
    } catch (ignored) {}
  }
}
