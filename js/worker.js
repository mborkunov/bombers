import Config from 'babel!./config';

class Worker {

  constructor(name, screen) {
    this.fps = 30;
    this.name = name;
    this.screen = screen;
    this.timeout = 0;
    this.lastCall = 0;
    this.retries = 0;
  }

  start() {
    this.loop();
  }

  loop() {
    this.lastCall = now();
    var screen = this.screen();
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
    var fps = typeof this.fps === 'object' ? this.fps.getValue() : this.fps;
    this.timeout = Math.abs(1000 / fps - (now() - this.lastCall));
    setTimeout(this.loop.bind(this), this.timeout);
  }
}

export class Graphics extends Worker {

  constructor(screen) {
    super('graphics', screen);
    this.fps = Config.getProperty('graphic.maxfps');
  }

  action(delay) {
    this.screen().render(delay);
  }
}

export class State extends Worker {

  constructor(screen) {
    super('state', screen);
    this.fps = 50;
  }

  action(delay) {
    this.screen().update(delay);
  }
}