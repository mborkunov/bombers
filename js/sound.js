import Config from 'babel!./config';

export default class Sound {

  static set enabled(value) {
    Sound._enabled = value;
  }

  static get enabled() {
    return Sound._enabled;
  }

  static set volume(value) {
    Sound._volume = value;
  }

  static get volume() {
    return Sound._volume;
  }

  static play(name) {
    if (!(Sound._enabled && Config.getProperty('sounds').getValue())) {
      return;
    }

    if (!Sound.pool) {
      Sound.pool = {};
    }

    if (Object.isUndefined(Sound.pool[name])) {
      this.pool[name] = [];
    }

    if (this.pool[name].length <= 10) {
      var audio = new Audio(`sounds/${name}.wav`);
      audio.preload = 'auto';
      audio.volume = Config.getProperty('volume').getValue();
      audio.observe('loadeddata', function(e) {
        e.element().play();
      });
      this.pool[name].push(audio);
    } else {
      for (var i = 0, length = this.pool[name].length; i < length; i++) {
        if (this.pool[name][i].ended) {
          this.pool[name][i].play();
          break;
        }
      }
    }
  }
}