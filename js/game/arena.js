var Arena = Class.create(Screen, {
  menu: null,
  name: 'Arena',
  rendered: false,
  direction: null,
  x: null,
  y: null,
  area: null,
  paused: false,
  battleField: null,
  overlay: null,
  dialog: null,
  shake: null,
  objects: null,

  init: function() {
    this.objects = $A([]);
    this.x = 0;
    this.y = 0;
    this.shake = 0;
    this.area = {
      x: 16, y: 10
    };
    this.direction = 0;
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

    var maps = ['Big_Standard','Blast_Matrix','Bloody_Ring','Boiling_Egg','Bomb_Attack',
      'Broken_Heart','Crammed','Death_Corridor','Dilemma','FearCircle',
      'FearCircle_Remix','FireWheels','Football','Four_Instance','Ghostbear',
      'Hard_Work','Hole_Run','Huge_Standard','Juicy_Lucy','Kitchen','Meeting',
      'MungoBane','Obstacle_Race','Overkill','Prison_Cells','Redirection',
      'Sixty_Nine','Small_Standard','Snake_Race','Tiny_Standard','Whole_Mess']

    var id = Math.round(Math.random() * maps.length);

    Map.load(maps[id], function(map) {
      this.map = map;
    }.bind(this));

    this.objects.push(new Bomber(new Controller.Keyboard()));

    this.prerender();
  },
  prerender: function() {
    if (this.map == null || this.rendered) {
      return;
    }

    this.rendered = true;

    var x = this.area.x, y = this.area.y;
    var width = Math.round(this.container.getWidth() / x);
    var height = Math.round(this.container.getHeight() / y);


    this.battleField = new Element('div').setStyle({position: 'relative'}).addClassName('field');

    this.map.render(this.battleField);


    this.container.appendChild(this.battleField);

    var themes = $A([
      {name: 'Default', id: 'default', color: 'silver'},
      {name: 'Dark', id: 'dark', color: 'gray'},
      {name: 'Snow', id: 'snow', color: 'snow'},
      {name: 'Green', id: 'green', color: 'green'},
      {name: 'Strange', id: 'strange', color: 'darkcyan'},
      {name: 'Stone', id: 'stone', color: 'yellow'}
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

    this.objects.each(function(item) {
      item.render(this.battleField);
    }.bind(this));
  },
  update: function(delay) {
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
      object.controller.update(this.keys);
    }.bind(this));

   this.map.update(delay, this.shake);
  },
  changeDirection: function() {
    //this.position = Math.round(Math.random()*3);
  },
  render: function(time) {
    this.prerender();

    this.objects.each(function(item) {
      item.render(this.battleField);
    }.bind(this));

    if (this.paused && !this.overlay) {
      this.overlay = new Element('div', {id: 'overlay'});
      this.dialog = new Element('div').addClassName('dialog');
      this.dialog.appendChild(new Element('a').addClassName('action').update('Return to main menu').observe('click', function() {
        Game.instance.setScreen(Menu);
      }));
      this.dialog.appendChild(new Element('a').addClassName('action').update('Cancel').observe('click', function() {
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


/*
var OptionGroup = Class.create({
  container: null,
  name: null,
  initialize: function(name) {
    this.name = name;
    this.container = new Element('div');
  },
  render: function() {
    return this.container
  }
});
*/
