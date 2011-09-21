var Game = Class.create({
  container: $('game-container'),
  screen: null,
  graphics: null,
  state: null,
  initialize: function() {
    this.setTheme(Config.get("graphic.theme"));
    Sound.setEnabled(Config.get("sounds"));
    Game.instance = this;
    this.setScreen(this.getStartScreen());
    this.graphics = new Graphics();
    this.state = new State();
  },
  overlay: {
    element: null,
    working: 0,
    timeout: null,
    add: function() {
      this.working = 0;
      if (!this.element) {
        this.element = new Element('div', {id: 'overlay'});
        Game.instance.container.appendChild(this.element);
      }
      this.element.style.setProperty('opacity', 1);
    },
    appear: function(callback) {
      console.info('appear');
      this.callback = callback;
      if (!this.element) {
        this.add();
      }
      this.opacity = 1;
      this.working = -1;
    },
    fade: function(callback) {
      console.info('fade');
      this.callback = callback;
      if (!this.element) {
        this.add();
      }
      this.opacity = 1;
      this.working = 1;
    },
    remove: function() {
      if (this.element) {
        //this.working = 0;
        this.element.remove();
        this.element = null;
      }
    },
    stop: function() {
      this.callback();
      this.callback = null;
      console.info('stop');
      clearTimeout(this.timeout);
      this.working = 0;
    },
    update: function() {
      if (this.working != 0 && this.element) {
        console.log('update', this.working, this.opacity);
        this.element.style.setProperty('opacity', this.opacity += this.working / 25);
        if (this.working < 0 && this.opacity <= 0) {
          this.stop();
          this.remove();
        } else if (this.working > 0 && this.opacity >=  1) {
          this.stop();
        }
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
    Config.set("graphic.theme", theme);
    var themeLink = $('theme');
    if (!themeLink) {
      themeLink = new Element('link', {id: 'theme', rel: 'stylesheet', type: 'text/css', name: theme});
      document.head.appendChild(themeLink);
    } else {
      document.body.removeClassName(themeLink.getAttribute('name'));
    }
    themeLink.setAttribute('href', 'css/themes/' + theme +'.css');
    themeLink.setAttribute('name', theme);
    document.body.addClassName(theme);
  },
  setScreen: function(screen) {
    var appearHandler = function() {
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
      location.hash = '#' + _screen.name;
      this.screen = _screen;
      this.screen.setSleeping(true);

      this.overlay.appear(function() {
        this.screen.setSleeping(false);
      }.bind(this));

      clearTimeout(this.overlay.timeout);
      this.overlay.timeout = setTimeout(this.overlay.update.bind(this.overlay), 10);
    }.bind(this);

    if (this.screen) {
      this.screen.setSleeping(true);
      this.overlay.fade(appearHandler);
    } else {
      appearHandler();
    }
    clearTimeout(this.overlay.timeout);
    this.overlay.timeout = setTimeout(this.overlay.update.bind(this.overlay), 10);
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
