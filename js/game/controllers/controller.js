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
}