var Sound = Class.create();

Object.extend(Sound, {
    container: $('sounds'),
    volume: 0.35,
    enabled: true,
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
        /**
         * todo: cache sounds
         */
        var audio = new Element('audio', {src: 'sounds/' + name + '.wav', autoplay: true});
        audio.volume = this.volume;
        audio.observe('ended', function() {
            this.parentNode.removeChild(this);
        }.bind(audio));
        Sound.container.appendChild(audio);
    }
});