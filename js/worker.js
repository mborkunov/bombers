var Worker = Class.create({
    defaultDelay: 20,
    lastcall: null,
    delay: null,
    initialize: function() {
        this.delay = this.defaultDelay;
    },
    start: function() {
        this.loop();
    },
    loop: function() {
        this.lastcall = new Date().getTime();
        try {
            this.action(this.delay);
        } catch (e) {
            console.log(e);
        }
        this.delay = Math.abs(this.defaultDelay - (new Date().getTime() - this.lastcall));
        setTimeout(this.loop.bind(this), this.delay);
    }
});
