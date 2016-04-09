export default class Screen {

  constructor(name, container) {
    this.name = name;
    this.container = container;
    this.sleeping = false;
    this.rendered = false;
    this.keys = [];
    this.listeners = {};
  }

  init() {
  }

  update() {}

  prerender() {
    this.rendered = true;
  }

  render() {}

  setSleeping(sleeping) {
    this.sleeping = sleeping;
  }

  dispatch() {
    this.container.update();
    this.rendered = false;
    this.listeners = {};
  }

  static register(screens) {
    Screen._screens = {};
    for (var screen in screens) {
      if (!screens.hasOwnProperty(screen)) continue;
      Screen._screens[screen.toLowerCase()] = screens[screen];
    }
  }

  static getScreen(name) {
    return Screen._screens[name];
  }

  static getCurrent() {
    //return Game.instance.getScreen();
  }
}