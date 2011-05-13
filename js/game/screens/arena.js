var Arena = Class.create(Screen, {
  name: 'Arena',
  rendered: false,
  paused: false,
  battleField: null,
  overlay: null,
  dialog: null,
  shake: null,
  objects: null,
  timeisup: null,

  init: function() {
    this.objects = {
      bombers: [],
      arbiter:  new Arbiter(),
      extras: [],
      each: function(call) {
        this.bombers.each(function(bomber) {
          call(bomber);
        });
        call(this.arbiter);
      }
    };
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
      }.bind(this),
      keyup: function(e) {
        if (this.keys.indexOf(e.keyCode) !== -1) {
          this.keys = this.keys.without(e.keyCode);
        }

        if (e.keyCode == 27 || e.keyCode == 19) {
          this.paused = !this.paused;
        }
      }.bind(this)
    }

    var maps = $A(['Big_Standard','Blast_Matrix','Bloody_Ring','Boiling_Egg','Bomb_Attack',
      'Broken_Heart','Crammed','Death_Corridor','Dilemma','FearCircle',
      'FearCircle_Remix','FireWheels','Football','Four_Instance','Ghostbear',
      'Hard_Work','Hole_Run','Huge_Standard','Juicy_Lucy','Kitchen','Meeting',
      'MungoBane','Obstacle_Race','Overkill','Prison_Cells','Redirection',
      'Sixty_Nine','Small_Standard','Snake_Race','Tiny_Standard','Whole_Mess']);

    var id = Math.floor(Math.random() * maps.length);

    Map.load(maps[id], function(map) {
      this.map = map;

      this.map.getPlayerStartupPositions().each(function(position) {
        var x = this.map.entry.size.x - 1, y = this.map.entry.size.y - 1;

        var bombers =  ['TUX', 'BSD', 'SPIDER', 'SNAKE', 'BALL-RED', 'BALL-YELLOW', 'BALL-GREEN', 'BALL-BLUE'];

        var controllerType;
        switch (Math.floor(Math.random() * 4)) {
          case 0:
              controllerType = Controller.Keyboard.Type.ARROWS;
            break;
          case 1:
              controllerType = Controller.Keyboard.Type.WASD;
            break;
          case 2:
              controllerType = Controller.Keyboard.Type.IJKL;
            break;
          case 3:
              controllerType = Controller.Keyboard.Type.ARROWS;
            break;
        }

        var location = new Point(Math.floor(x / 2), Math.floor(y / 2));
        var controller = new Controller.Keyboard(controllerType);
        var bomber = new Bomber(controller, bombers[Math.floor(Math.random() * 8)], location);
        bomber.flyTo(this.map.entry.tiles[position.point.getX()][position.point.getY()]);
        this.objects.bombers.push(bomber);
      }.bind(this));
      this.prerender();
    }.bind(this));
  },
  prerender: function() {
    this.rendered = true;

    this.battleField = new Element('div').setStyle({position: 'relative'}).addClassName('field');
    this.map.prerender(this.battleField);
    this.container.appendChild(this.battleField);

    this.renderThemeSwitcher();
    this.battleField.appendChild(new Element('div', {id: 'logo'}));

    this.objects.each(function(object) {
      object.render(this.battleField);
    }.bind(this));
  },
  renderThemeSwitcher: function() {
    var themes = $A([
      {name: 'Default', id: 'default', color: 'gray'},
      {name: 'Original', id: 'original', color: 'silver'},
      {name: 'Debug', id: 'debug', color: 'red'},
      {name: 'Snow', id: 'snow', color: 'snow'}
    ]);
    var themesElement = new Element('div').setStyle({position: 'absolute', top: 0, right: 0, zIndex: 10, height: '30px', width: (30 * themes.size()) + 'px'});
    this.container.appendChild(themesElement);

    themes.each(function(theme) {
      var themeEl = new Element('div', {title: theme.name, theme: theme.id}).setStyle({'float': 'left', background: theme.color, width: '30px', height: '30px'});
      this.appendChild(themeEl);
      themeEl.observe('mouseover', function(e) {
        Game.instance.setTheme(e.element().getAttribute('theme'));
      });
    }.bind(themesElement));
  },
  update: function(delay) {
    if (this.map == null) return;
    if (this.paused) return;
    if (this.keys.indexOf(Event.KEY_HOME) != -1) {
      if (typeof (this.timeout) != 'undefined') {
        clearTimeout(this.timeout);
      }
      this.shake = 1;
      this.timeout = setTimeout(function() {
        this.shake = -1;
      }.bind(this), 100);
    }

    this.objects.each(function(object) {
      if (object instanceof Bomber) {
        object.controller.update(this.keys, delay);
      }
      if (object instanceof Arbiter && !object.isRunning()) {
        return;
      }
      object.update(delay, this.map);
    }.bind(this));

    this.map.update(delay, this.shake);
    //this.map.highlight(this.objects.bombers);
  },
  render: function(time) {
    if (!this.rendered) return;
    if (!this.paused) {
      this.map.render(this.battleField);

      this.objects.each(function(item) {
        item.render(this.battleField);
      }.bind(this));
    }

    if (this.paused && !this.dialog) {
      this.overlay = new Element('div', {id: 'overlay'});
      this.overlay.observe('click', function(e) {e.element().remove()});
      this.dialog = new Element('div').addClassName('dialog');
      this.dialog.appendChild(new Element('a').addClassName('action').update('Abort ').observe('click', function() {
        Game.instance.setScreen(Menu);
      }));
      this.dialog.appendChild(new Element('a').addClassName('action').update('Resume').observe('click', function() {
        this.paused = false;
      }.bind(this)));
      this.container.appendChild(this.overlay);
      this.container.appendChild(this.dialog);
    } else if (!this.paused && this.dialog) {
      this.container.removeChild(this.dialog);
      try {
        this.container.removeChild(this.overlay);
      } catch (ignored) {}
      this.overlay = this.dialog = null;
    }
  },
  dispatch: function() {
    this.rendered = false;
    this.container.removeChild(this.battleField);
    if (this.overlay) {
      this.container.removeChild(this.dialog);
      this.container.removeChild(this.overlay);
    }

  }
});
