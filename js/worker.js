var Worker = Class.create({
    defaultDelay: 30,
    lastcall: null,
    delay: null,
    initialize: function() {
        this.delay = this.defaultDelay;
    },
    start: function() {
        this.loop();
    },
    loop: function() {
        this.lastcall = date();
        try {
            this.action(this.delay);
        } catch (e) {}
        this.delay = Math.abs(this.defaultDelay - (date() - this.lastcall));
        setTimeout(this.loop.bind(this), this.delay);
    }
});
