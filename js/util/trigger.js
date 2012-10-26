var Trigger = Class.create({
  done: null,
  condition: null,
  success: null,
  initialize: function(condition, success) {
    this.done = false;
    this.success = success;
    this.condition = condition;
  },
  check: function() {
    if (this.done || !this.condition()) {
      return false;
    }
    this.done = true;
    this.success();
    return true;
  }
});