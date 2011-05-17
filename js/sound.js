if (Object.isUndefined(Audio)) {
  var Audio = function(source) {
    this.src = source;
  };
  Audio.prototype.play = function() {}
}
var Sound = Class.create();

Object.extend(Sound, {
    container: $('sounds'),
    volume: 0.35,
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
        if (!this.enabled) {
            return;
        }

        if (Object.isUndefined(this.pool[name])) {
          this.pool[name] = [];
        }

        if (this.pool[name].length <= this.poolSize) {
          var audio = new Audio('sounds/' + name + '.wav');
          audio.preload = 'auto';
          audio.volume = this.volume;
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
