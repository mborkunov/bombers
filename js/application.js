/*
 if (Prototype.Browser.IE) {
 window.onload = function() {
 document.getElementById('game-container').innerHTML = '<img src="images/ie.png" style="margin: 70px 170px;"/>';
 }
 }
 if (typeof(console) == 'undefined') {
 window.console = {
 log: function() {},
 info: function() {}
 };
 } 

 if (!Object.isUndefined(window.applicationCache)) {
 window.applicationCache.addEventListener('updateready', function(e) {
 if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
 window.applicationCache.swapCache();
 if (confirm('A new version of this game is available. Load it?')) {
 window.location.reload();
 }
 }
 }, false);
 }


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

document.addEventListener('DOMContentLoaded', () => {
  Config.initialize({
    onSuccess: function () {
      console.info('config was successfully loaded');

      if (!Config.getValue('debug')) {
        document.onmousedown = function () {
          return false
        }; // disable text selection - chromium
        document.oncontextmenu = function () {
          return false
        }; // disable context menu
      }

      new Game().start();
    },
    onFailure: function () {
      console.error('cannot load config file');
    }
  });
}, false);
