var Worker = Class.create({
  defaultFps: 30,
  lastCall: null,
  fps: null,
  initialize: function() {
    this.fps = this.defaultFps;
    this.timeout = 0;
    this.lastCall = 0;
  },
  start: function() {
    this.loop();
  },
  loop: function() {
    this.lastCall = date();
    var screen = Game.instance.getScreen();
    try {
      if (screen && !screen.sleeping) {
        this.action(date() - this.lastCallEnd);
      }
    } catch (e) {
      console.log(e);
    }
    this.lastCallEnd = date();
    this.timeout = Math.abs(1000 / this.fps - (date() - this.lastCall));
    setTimeout(this.loop.bind(this), this.timeout);
  }
});

var Graphics = Class.create(Worker, {
  initialize: function() {
    this.fps = Config.getProperty('graphic.maxfps').getValue();
  },
  action: function(delay) {
    Game.instance.getScreen().render(delay);
  }
});

var State = Class.create(Worker, {
  initialize: function() {
    this.fps = 50;
  },
  action: function(delay) {
    Game.instance.getScreen().update(delay);
  }
});

