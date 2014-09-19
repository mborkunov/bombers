var Worker = Class.create({
  /** @type Integer */
  defaultFps: 30,
  /** @type Integer */
  lastCall: null,
  /** @type Integer */
  fps: null,
  /** @type String */
  name: null,
  retries: null,
  initialize: function() {
    this.fps = this.defaultFps;
    this.timeout = 0;
    this.lastCall = 0;
    this.retries = 0;
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
      if (this.retries++ >= 5) {
        console.log('Maximum number of retries exceeded', e);
        return;
      }
      console.log('Worker failed ' + [this.name], e);
    }
    this.lastCallEnd = now();
    var fps = this.fps instanceof Config.Property ? this.fps.getValue() : this.fps;
    this.timeout = Math.abs(1000 / fps - (now() - this.lastCall));
    setTimeout(this.loop.bind(this), this.timeout);
  }
});

var Graphics = Class.create(Worker, {
  name: 'graphics',
  initialize: function() {
    this.fps = Config.getProperty('graphic.maxfps');
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

