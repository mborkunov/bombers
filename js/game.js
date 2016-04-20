import Config from 'babel!./config';
import {Graphics, State} from 'babel!./worker';
import Sound from 'babel!./sound';
import Screen from 'babel!./game/screens/screen';
import * as screens from 'babel!./game/screens';
import Intro from 'babel!./game/screens/intro';

export default class Game {

  constructor() {
    Screen.register(screens);
    this.overlay = new Overlay();
    this.container = $('container');

    Config.getProperty("graphic.theme").addListener(function(theme) {
      this.setTheme(theme);
    }.bind(this));
    Sound.initialize();
    Game.instance = this;
    this.setScreen(this.getStartScreen());
    this.graphics = new Graphics(this.getScreen.bind(this));
    this.state = new State(this.getScreen.bind(this));
    Config.getProperty("graphic.shadows").addListener(function(shadows) {
      this.container.classList.toggle('shadows', shadows);
    }.bind(this));

    Config.getProperty('debug').addListener(function(debug) {
      if (debug) {
        this.drawThemesSwitcher();
      } else {
        var switcher = document.getElementById('theme-switcher');
        switcher.parentNode.removeChild(switcher);
      }
    }.bind(this));
  }

  drawThemesSwitcher() {
    var themes = Config.getProperty('graphic.theme').getValues();
    var themesElement = new Element('div', {id: 'theme-switcher'}).setStyle({position: 'absolute', top: 0, right: 0, zIndex: 10, height: '30px', width: (30 * themes.size()) + 'px'});
    this.container.appendChild(themesElement);
    var colors = ['green', 'yellow', 'silver', 'blue', 'red'];

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

  getStartScreen() {
    var screen;
    if (location.hash.length > 0) {
      var _screen = location.hash.substr(1).toLowerCase();
      _screen = _screen.substr(0, 1).toUpperCase() + _screen.substr(1);
      screen = Screen.getScreen(_screen.toLowerCase());
    }
    return screen || Intro;
  }

  start() {
    this.graphics.start();
    this.state.start();
  }

  setTheme(theme) {
    if (theme == null) return;
    if (document.body.hasClassName(this.currentTheme)) {
      document.body.removeClassName(this.currentTheme);
    }

    document.body.addClassName(theme);
    this.currentTheme = theme;
  }

  setScreen(screen) {
    let args = arguments;
    var appear = function() {
      if (this.screen) {
        this.screen.setSleeping(false);
        this.dispatchScreen();
      }
      var _screen;

      _screen = new screen(this.container, this.setScreen.bind(this), $A(args).slice(1));
      _screen.instance = _screen;
      if (Object.isUndefined(screen.instance)) {

      } else {
        //_screen = screen.instance;
        //_screen.prerender();
      }
      var listeners = _screen.listeners;
      for (var event in listeners) {
        if (!listeners.hasOwnProperty(event)) continue;
        if (event.indexOf('key') === 0) {
          document.observe(event, listeners[event], false);
        } else {
          this.container.observe(event, listeners[event]);
        }
      }

      this.container.removeClassName(this.screen ? this.screen.name.toLowerCase() : null).addClassName(_screen.name.toLowerCase());

      history.pushState({}, _screen.name + ' | Bombers', "#" + _screen.name);
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
  }

  getScreen() {
    return this.screen;
  }

  dispatchScreen() {
    this.dispatchListeners();
    this.screen.dispatch();
  }

  dispatchListeners() {
    var listeners = this.screen.listeners;

    for (var event in listeners) {
      if (!listeners.hasOwnProperty(event)) continue;
      if (event.indexOf('key') === 0) {
        document.stopObserving(event, listeners[event], false);
      } else {
        this.container.stopObserving(event, listeners[event]);
      }
    }
  }
}

class Overlay {

  constructor() {
    this.element = null;
    this.working = 0;
    this.timeout = null;
  }

  add() {
    this.working = 0;
    this.element = new Element('div', {id: 'overlay'});
    this.element.style.setProperty('opacity', 1, null);
    Game.instance.container.appendChild(this.element);
  }
  appear(callback) {
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
  }

  fade(callback) {
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
  }

  remove() {
    this.element.hide();
  }

  stop() {
    this.working = 0;
    clearTimeout(this.timeout);
    this.callback();
  }

  update() {
    if (this.working != 0 && this.element) {
      this.element.style.setProperty('opacity', Math.max(0, this.opacity += this.working / 25).toFixed(2), '');
      this.working *= 1.1;
      if (this.working < 0 && this.opacity <= 0) {
        this.stop();
        this.remove();
      } else if (this.working > 0 && this.opacity >= 1) {
        this.stop();
      }
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.update.bind(this), 10);
    }
  }
}

