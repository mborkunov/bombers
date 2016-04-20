/*
if ('onhashchange' in window) {
Unfortunately, there is a strange behavior in chrome

console.log('load', window, window.__proto__.onhashchange);

/window.hashChangeHandler = function(e) {
if (window.hashChangeEnabled) {
var _screen = e.target.location.hash.substr(1).toLowerCase();
_screen = _screen.substr(0, 1).toUpperCase() + _screen.substr(1);
Game.instance.setScreen(Game.instance.getScreenByName(_screen));
}
};/
window.onhashchange = window.hashChangeHandler;
}*/

import Config from "babel!./config";
import Game from "babel!./game";


if (window.applicationCache) {
  window.applicationCache.addEventListener('updateready', function () {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      window.applicationCache.swapCache();
      if (confirm('A new version of this game is available. Load it?')) {
        window.location.reload();
      }
    }
  }, false);
}

document.addEventListener('DOMContentLoaded', () => {
  Config.initialize({
    onSuccess: function () {
      console.info('config was successfully loaded');

      Config.getProperty('debug').addListener(function(debug) {
        document.onmousedown = function () {
          return debug;
        }; // disable text selection - chromium

        document.oncontextmenu = function () {
          return debug;
        }; // disable context menu
      }, false);

      new Game().start();
    },
    onFailure: function () {
      console.error('cannot load config file');
    }
  });
}, false);
