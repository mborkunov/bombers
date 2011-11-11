define('screens/arena', ['screens/screen'], function() {
  Game.Screen.Arena = Class.create(Game.Screen, {
    name: 'Arena',
    rendered: false,
    paused: false,
    battleField: null,
    overlay: null,
    dialog: null,
    shake: null,
    objects: null,
    timeisup: null,
    updateObjectsHandler: null,
    renderObjectsHandler:  null,
    scoreScreenTimeout: null,
    shakyExplosions: null,
    checkBomberFilter: function(bomber) {return !bomber.isDead()},
    init: function() {
      this.objects = {
        bombers: [],
        bombs: [],
        explosions: [],
        arbiter:  new Game.Object.Arbiter(),
        extras: [],
        each: function(call) {
          Util.iterate(this.bombers, call);
          Util.iterate(this.bombs, call);
          Util.iterate(this.extras, call);
          Util.iterate(this.explosions, call);

          call(this.arbiter);
        }
      };
      this.shakyExplosions = Config.getProperty('graphic.shaky_explosions').getValue();
      this.shake = 0;
      this.timeisup = false;
      this.rendered = false;
      this.listeners = {
        mousemove: function(e) {
        },
        keydown: function(e) {
          if (this.keys.indexOf(e.keyCode) === -1) {
            this.keys.push(e.keyCode);
          }
          if (e.keyCode == 83 && e.hasModifiers()) {
            if (Config.change('graphic.shadows')) {
              Game.instance.container.addClassName('shadows');
            } else {
              Game.instance.container.removeClassName('shadows');
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
          if (object instanceof Game.Object.Bomber) {
            object.controller.update(this.keys, delay);
          }
          object.update(delay, this.map);
        } catch (e) {
          console.error(e);
        }
      }.bind(this);
      this.renderObjectsHandler = function(item) {
        try {
          item.render(this.battleField);
        } catch (e) {
          console.error(e);
        }
      }.bind(this);

      Game.Map.getNextMap(function(map) {
        this.map = map;

        var players = Config.Players.getActivePlayers();
        var positions = this.map.getPlayerStartupPositions();

        var x = this.map.entry.size.x - 1, y = this.map.entry.size.y - 1;
        var defaultLocation = new Point(Math.floor(x / 2), Math.floor(y / 2));
        for (var i = 0, length = positions.length; i < length; i++) {
          var player = players[i];

          var controller;
          switch (player.getValue('controller')) {
            case 'ai':
              controller = new Game.Controller.Ai();
              break;
            default:
              var type = Game.Controller.Keyboard.Type[player.getValue('controller').toUpperCase()];
              controller = new Game.Controller.Keyboard(type);
              break;
          }
          var position = positions[i % positions.length];
          var bomber = new Game.Object.Bomber(controller, i + 1, defaultLocation.clone(), player.getConfig());
          bomber.flyTo(this.map.entry.tiles[position.point.getX()][position.point.getY()]);
          this.objects.bombers.push(bomber);
        }
        this.prerender();
      }.bind(this));
    },

    add: function(object) {
      if (object instanceof Game.Object.Bomber) {
        this.objects.bombers.push(object);
      } else if (object instanceof Game.Object.Extra) {
        this.objects.extras.push(object);
      } else if (object instanceof Game.Object.Explosion) {
        this.objects.explosions.push(object);
      } else if (object instanceof Game.Object.Bomb) {
        this.objects.bombs.push(object);
      }
    },
    remove: function(object) {
      if (object instanceof Game.Object.Bomber) {
        this.objects.bombers = this.objects.bombers.without(object);
      } else if (object instanceof Game.Object.Extra) {
        this.objects.extras = this.objects.extras.without(object);
      } else if (object instanceof Game.Object.Explosion) {
        this.objects.explosions = this.objects.explosions.without(object);
      } else if (object instanceof Game.Object.Bomb) {
        this.objects.bombs = this.objects.bombs.without(object);
      }
    },
    hasBomb: function(location) {
      for (var i = 0; i < this.objects.bombs.length; i++) {
        var bomb = this.objects.bombs[i];
        if (bomb.getLocation().equals(location)) {
          return true;
        }
      }
      return false;
    },
    prerender: function() {
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
    },
    checkBombers: function() {
      if (!this.scoreScreenTimeout && this.objects.bombers.filter(this.checkBomberFilter).length == 0) {
        this.scoreScreenTimeout = setTimeout(function() {
          Game.instance.setScreen(Game.Screen.Score);
        }, 1000);
      }
    },
    update: function(delay) {
      if (this.map == null) return;
      if (this.paused) return;
      if (Config.getValue('debug') && this.keys.indexOf(Event.KEY_HOME) != -1) {
        this.shakeIt();
      }

      this.objects.each(this.updateObjectsHandler);
      this.map.update(delay, this.shake);
      this.checkBombers();
    },
    shakeIt: function() {
      if (!this.shakyExplosions) return;
      if (!Object.isUndefined(this.timeout)) {
        clearTimeout(this.timeout);
      }
      this.shake = 1;
      this.timeout = setTimeout(function() {
        this.shake = -1;
      }.bind(this), 300);
    },
    render: function(time) {
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
          Game.instance.setScreen(Game.Screen.Menu);
        }));
        this.dialog.appendChild(new Element('a').addClassName('action').update('Resume').observe('click', function() {
          this.paused = false;
        }.bind(this)));
        window.google_ad_client = "ca-pub-8348571392367855";
        window.google_ad_slot = "9307338421";
        window.google_ad_width = 468;
        window.google_ad_height = 60;
        google_ad_client = "ca-pub-8348571392367855";
        google_ad_slot = "9307338421";
        google_ad_width = 468;
        google_ad_height = 60;

        var adblock = new Element('div').addClassName('adblock');
        adblock.appendChild(new Element('script', {
          type: 'text/javascript',
          src: 'http://pagead2.googlesyndication.com/pagead/show_ads.js'
        }));
        this.dialog.appendChild(adblock);
        this.container.appendChild(this.overlay);
        this.container.appendChild(this.dialog);
        console.log(window)
      } else if (!this.paused && this.dialog) {
        $('field').removeClassName('filter');
        this.dialog.remove();
        try {
          this.overlay.remove();
        } catch (ignored) {}
        this.overlay = this.dialog = null;
      }
    },
    dispatch: function() {
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
  });

});
