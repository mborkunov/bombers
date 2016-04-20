export default class {

  constructor(condition, success) {
    this.done = false;
    this.success = success;
    this.condition = condition;
  }

  check() {
    if (this.done || !this.condition()) {
      return false;
    }
    this.success();
    return this.done = true;
  }
}