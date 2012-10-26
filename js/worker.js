var Worker = Class.create({
  /** @type Integer */
  defaultFps: 30,
  /** @type Integer */
  lastCall: null,
  /** @type Integer */
  fps: null,
  /** @type String */
  name: null,
  initialize: function() {
    this.fps = this.defaultFps;
    this.timeout = 0;
    this.lastCall = 0;
  },
  start: function() {
    this.loop();
  },
  loop: function() {
    this.lastCall = now();
    var screen = Game.instance.getScreen();
    try {
      if (screen && !screen.sleeping) {
        this.action(now() - this.lastCallEnd);
      }
    } catch (e) {
      console.log(e, this.name);
    }
    this.lastCallEnd = now();
    this.timeout = Math.abs(1000 / this.fps - (now() - this.lastCall));
    setTimeout(this.loop.bind(this), this.timeout);
  }
});

var Graphics = Class.create(Worker, {
  name: 'graphics',
  initialize: function() {
    this.fps = Config.getProperty('graphic.maxfps').getValue();
  },
  action: function(delay) {
    Game.instance.getScreen().render(delay);
  }
});

var State = Class.create(Worker, {
  name: 'state',
  initialize: function() {
    this.fps = 50;
  },
  action: function(delay) {
    Game.instance.getScreen().update(delay);
  }
});

