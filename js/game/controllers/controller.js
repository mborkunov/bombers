export default class {

  constructor() {
    this.active = true;
    this.reverse = false;
    this.autoShoot = false;
  }

  attach(bomber) {
    this.bomber = bomber;
  }

  revert() {
    this.reverse = !this.reverse;
  }

  setAutoShoot(autoShoot) {
    this.autoShoot = autoShoot;
  }

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }

  update() {
  }

  react(up, right, down, left, action, delay) {
    if (!(left && right)) {
      if (left) {
        this.bomber.move(3, delay);
      } else if (right) {
        this.bomber.move(1, delay);
      }
    }

    if (!(down && up) && !(left || right)) {
      if (up) {
        this.bomber.move(0, delay);
      } else if (down) {
        this.bomber.move(2, delay);
      }
    }

    if (action) {
      this.bomber.spawnBomb();
    }
  }
}