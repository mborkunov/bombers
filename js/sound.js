var Sound = Class.create();

Object.extend(Sound, {
    container: $('sounds'),
    volume: 0.35,
    enabled: true,
    poolSize: 3,
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
        if (!this.enabled) {
            return;
        }

        if (typeof(this.pool[name]) == 'undefined') {
          this.pool[name] = [];
        }


        if (this.pool[name].length <= this.poolSize) {
          /**
           * todo: cache sounds
           */
          var audio = new Audio('sounds/' + name + '.wav');
          audio.preload = 'none';
          audio.volume = this.volume;
          this.pool[name].push(audio);
          audio.play();
        } else {
          for (var i = 0; i < this.pool[name].length; i++) {
            if (this.pool[name][i].ended) {
              this.pool[name][i].play();
              break;
            }
          }
        }

    }
});