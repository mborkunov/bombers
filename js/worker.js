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
        this.delay = Math.abs(this.delay - (date() - this.lastcall));
        setTimeout(this.loop.bind(this), this.delay);
    }
});

var Graphics = Class.create(Worker, {
  initialize: function() {
    this.delay = 30;
  },
  action: function() {
    Game.instance.getScreen().render();
  }
});


var State = Class.create(Worker, {
  initialize: function() {
    this.delay = 20;
  },
  action: function(delay) {
    Game.instance.getScreen().update(delay);
  }
});

