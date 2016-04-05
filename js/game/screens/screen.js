export default class Screen {

  constructor(name, container) {
    this.name = name;
    this.container = container;
    this.sleeping = false;
    this.rendered = false;
    this.keys = [];
    this.listeners = {};
    //this.game = Game.instance;
  }

  //get listeners() { return this.listeners}

  init() {}

  update() {}

  prerender() {}

  render() {}

  setSleeping(sleeping) {
    this.sleeping = sleeping;
  }

  dispatch() {
    this.container.update();
    this.rendered = false;
    this.listeners = {};
  }

/*  static register(name, screen) {
    if (typeof Screen.items == 'undefined') {
      Screen.items = {};
    }
    Screen.items[name] = screen;
  }*/

  static getScreen(name) {
    return Screen.items[name];
  }

  static getCurrent() {
    //return Game.instance.getScreen();
  }
}