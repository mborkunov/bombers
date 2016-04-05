import Config from 'babel!./config';

var Sound = Class.create();

Object.extend(Sound, {
    container: $('sounds'),
    volume: 1,
    enabled: true,
    poolSize: 10,
    pool: {},
    isEnabled: function() {
        return this.enabled;
    },
    setEnabled: function(enabled) {
        this.enabled = enabled;
    },
    setVolume: function (volume) {
        this.volume = volume;
    },
    play: function(name) {
        if (!this.enabled || !Config.getProperty('sounds').getValue()) {
            return;
        }

        if (Object.isUndefined(this.pool[name])) {
          this.pool[name] = [];
        }

        if (this.pool[name].length <= this.poolSize) {
          var audio = new Audio('sounds/' + name + '.wav');
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
});

export default Sound;