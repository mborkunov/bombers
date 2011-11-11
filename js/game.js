var Game = Class.create({
  container: $('game-container'),
  screen: null,
  graphics: null,
  state: null,
  currentTheme: null,
  initialize: function() {
    this.setTheme(Config.getProperty("graphic.theme").getValue());
    Sound.setEnabled(Config.getProperty("sounds").getValue());
    Game.instance = this;
    this.setScreen(this.getStartScreen());
    this.graphics = new Graphics();
    this.state = new State();
    if (Config.getProperty("graphic.shadows").getValue()) {
      this.container.addClassName('shadows');
    }

    if (Config.getValue('debug')) {
      var themes = Config.getProperty('graphic.theme').getValues();
      var themesElement = new Element('div').setStyle({position: 'absolute', top: 0, right: 0, zIndex: 10, height: '30px', width: (30 * themes.size()) + 'px'});
      this.container.appendChild(themesElement);
      var colors = ['green', 'yellow', 'silver'];

      themes.each(function(theme, i) {
        var themeEl = new Element('div', {title: theme, theme: theme}).setStyle({'float': 'left', background: colors[i], width: '30px', height: '30px'});
        var input = new Element('input', {type: 'radio', name: 'theme', theme: theme}).setStyle({width: '30px', height: '30px'});
        if (Config.getValue('graphic.theme') == theme) {
          input.setAttribute('checked', 'checked');
        }
        themeEl.appendChild(input);
        this.appendChild(themeEl);
        input.observe('click', function(e) {
          Config.getProperty("graphic.theme").setValue(e.element().getAttribute('theme'));
          Game.instance.setTheme(Config.getProperty("graphic.theme").getValue());
        });
      }.bind(themesElement));
    }
  },
  overlay: {
    element: null,
    working: 0,
    timeout: null,
    add: function() {
      this.working = 0;
      this.element = new Element('div', {id: 'overlay'});
      this.element.style.setProperty('opacity', 1, null);
      Game.instance.container.appendChild(this.element);
    },
    appear: function(callback) {
      this.callback = callback;
      try {
        this.element.show();
      } catch (e) {
        this.add();
      }
      this.opacity = 1;
      this.working = -1;
      this.element.style.setProperty('opacity', 1, null);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.update.bind(this), 10);
    },
    fade: function(callback) {
      this.callback = callback;
      try {
        this.element.show();
      } catch (e) {
        this.add();
      }

      this.opacity = 0;
      this.working = 1;
      this.element.style.setProperty('opacity', 0, null);
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.update.bind(this), 10);
    },
    remove: function() {
      this.element.hide();
    },
    stop: function() {
      this.working = 0;
      clearTimeout(this.timeout);
      this.callback();
    },
    update: function() {
      if (this.working != 0 && this.element) {
        this.element.style.setProperty('opacity', this.opacity += this.working / 25, null);
        this.working *= 1.1;
        if (this.working < 0 && this.opacity <= 0) {
          this.stop();
          this.remove();
        } else if (this.working > 0 && this.opacity >=  1) {
          this.stop();
        }
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.update.bind(this), 10);
      }
    }
  },
  getStartScreen: function() {
    var screen = Game.Screen.Intro;
    if (location.hash.length > 0) {
      var _screen = location.hash.substr(1).toLowerCase();
      _screen = _screen.substr(0, 1).toUpperCase() + _screen.substr(1);
      screen = this.getScreenByName(_screen);
    }
    return screen;
  },
  getScreenByName: function(name) {
    try {
        return eval('Game.Screen.' + name);
    } catch (e) {}
  },
  start: function() {
      this.graphics.start();
      this.state.start();
  },
  setTheme: function(theme) {
    if (theme == null) return;
    //Config.getProperty("graphic.theme").setValue(theme);
    /*var themeLink = $('theme');
    if (!themeLink) {
      themeLink = new Element('link', {id: 'theme', rel: 'stylesheet', type: 'text/css', name: theme});
      document.head.appendChild(themeLink);
    } else {
      document.body.removeClassName(themeLink.getAttribute('name'));
    }*/

    if (document.body.hasClassName(this.currentTheme)) {
      document.body.removeClassName(this.currentTheme);
    }

    document.body.addClassName(theme);
    this.currentTheme = theme;

    /*themeLink.setAttribute('href', 'css/themes/' + theme +'.css');
    themeLink.setAttribute('name', theme);*/
    //document.body.addClassName(theme);
  },
  setScreen: function(screen) {
    var appear = function() {
      if (this.screen) {
        this.screen.setSleeping(false);
        this.dispatchScreen();
      }
      var _screen = new screen();
      for (var event in _screen.listeners) {
        if (event.indexOf('key') === 0) {
          document.observe(event, _screen.listeners[event], false);
        } else {
          this.container.observe(event, _screen.listeners[event]);
        }
      }

      this.container.removeClassName(this.screen ? this.screen.name.toLowerCase() : null).addClassName(_screen.name.toLowerCase());

      history.pushState({page: 1}, _screen.name + ' | Happy Bombers', "#" + _screen.name);

      this.screen = _screen;
      this.screen.setSleeping(true);

      this.overlay.appear(function() {
        this.screen.setSleeping(false);
      }.bind(this));
    }.bind(this);

    var fade = function() {
      this.screen.setSleeping(true);
      this.overlay.fade(appear);
    }.bind(this);

    if (this.screen) {
      fade();
    } else {
      appear();
    }
  },
  getScreen: function() {
    return this.screen;
  },
  dispatchScreen: function() {
    this.dispatchListeners();
    this.screen.dispatch();
  },
  dispatchListeners: function() {
    for (var event in this.screen.listeners) {
      if (event.indexOf('key') === 0) {
        document.stopObserving(event, this.screen.listeners[event], false);
      } else {
        this.container.stopObserving(event, this.screen.listeners[event]);
      }
    }
  }
});
