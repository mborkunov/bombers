var date = function() {
  return new Date().getTime();
};

KeyboardEvent.prototype.hasModifiers = function() {
  return (this.ctrlKey || this.altKey || this.shiftKey || this.metaKey);
}