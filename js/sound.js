var Sound = Class.create({
    initialize: function() {
    }
});

Object.extend(Sound, {
    container: $('sounds'),
    play: function(name) {
        /**
         * todo: cache sounds
         */
        var audio = new Element('audio', {src: 'sounds/' + name + '.wav', autoplay: true});
        audio.observe('ended', function() {
            this.parentNode.removeChild(this);
        }.bind(audio));
        Sound.container.appendChild(audio);
    }
})