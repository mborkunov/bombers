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

        if (e.keyCode == 27) {
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

        var bomber = new Bomber(new Controller.Keyboard(Controller.Keyboard.Type.ARROWS), "red", {x: x / 2, y: y / 2});
        bomber.flyTo(this.map.entry.tiles[position.x][position.y]);
        this.objects.bombers.push(bomber);
      }.bind(this));
      this.prerender();
    }.bind(this));

    //this.bombers.push(new Bomber(new Controller.Keyboard(Controller.Keyboard.Type.WASD), "green", {x: 5, y: 2}));
    //this.bombers.push(new Bomber(new Controller.Keyboard(Controller.Keyboard.Type.IJKL), "blue"));
    //this.bombers.push(new Bomber(new Controller.Keyboard(Controller.Mouse), "yellow"), {x: 2, y: 5});
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
      {name: 'Default', id: 'green', color: 'green'},
      {name: 'Classic', id: 'default', color: 'silver'},
      {name: 'Snow', id: 'snow', color: 'snow'}/*,
      {name: 'Dark', id: 'dark', color: 'gray'},
      {name: 'Strange', id: 'strange', color: 'darkcyan'},
      {name: 'Stone', id: 'stone', color: 'yellow'}*/
    ]);
    var themesElement = new Element('div').setStyle({position: 'absolute', top: 0, right: 0, zIndex: 10, height: '20px', width: (20 * themes.size()) + 'px'});
    this.container.appendChild(themesElement);

    themes.each(function(theme) {
      var themeEl = new Element('div', {title: theme.name, theme: theme.id}).setStyle({'float': 'left', background: theme.color, width: '20px', height: '20px'});
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
    this.map.highlight(this.objects.bombers);
  },
  render: function(time) {
    if (!this.rendered) return;
    if (!this.paused) {
      this.map.render(this.battleField);

      this.objects.each(function(item) {
        item.render(this.battleField);
      }.bind(this));
    }

    if (this.paused && !this.overlay) {
      this.overlay = new Element('div', {id: 'overlay'});
      this.dialog = new Element('div').addClassName('dialog');
      this.dialog.appendChild(new Element('a').addClassName('action').update('Abort ').observe('click', function() {
        Game.instance.setScreen(Menu);
      }));
      this.dialog.appendChild(new Element('a').addClassName('action').update('Resume').observe('click', function() {
        this.paused = false;
      }.bind(this)));
      this.container.appendChild(this.overlay);
      this.container.appendChild(this.dialog);
    } else if (!this.paused && this.overlay) {
      this.container.removeChild(this.overlay);
      this.container.removeChild(this.dialog);
      this.overlay = null;
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
