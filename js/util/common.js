var date = function() {
  return new Date().getTime();
};

(KeyboardEvent || Event).prototype.hasModifiers = function() {
  return (this.ctrlKey || this.altKey || this.shiftKey || this.metaKey);
}