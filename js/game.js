var Game = Class.create({
  container: $('game-container'),
  screen: null,
  graphics: null,
  state: null,
  initialize: function() {
    this.setTheme(localStorage.getItem('theme') || 'default');
    Game.instance = this;
    this.setScreen(this.getStartScreen());
    this.graphics = new Graphics();
    this.state = new State();
  },
  getStartScreen: function() {
    var screen = Game.Screen.Intro;
    if (location.hash.length > 0) {
      var _screen = location.hash.substr(1).toLowerCase();
      _screen = _screen.substr(0, 1).toUpperCase() + _screen.substr(1);
      try {
        var screen = eval('Game.Screen.' + _screen);
      } catch (e) {
      }
    }
    return screen;
  },
  start: function() {
      this.graphics.start();
      this.state.start();
  },
  setTheme: function(theme) {
    if (theme == null) return;
    localStorage.setItem('theme', theme);
    var themeLink = $('theme');
    if (!themeLink) {
      themeLink = new Element('link', {id: 'theme', rel: 'stylesheet', type: 'text/css', name: theme});
      document.head.appendChild(themeLink);
    } else {
      document.body.removeClassName(themeLink.getAttribute('name'));
    }
    themeLink.setAttribute('href', 'css/themes/' + theme +'.css?' + Math.random());
    themeLink.setAttribute('name', theme);
    document.body.addClassName(theme);
  },
  setScreen: function(screen) {
    if (this.screen !== null) {
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
