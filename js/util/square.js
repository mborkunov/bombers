var Square = Class.create({
  location: null,
  width: null,
  height: null,
  initialize: function(location, width, height) {
    this.location = location;
  },
  setLocation: function(location) {
    this.location = location;
  },
  setWidth: function(width) {
    this.width = width;
  },
  setHeight: function(height) {
    this.height = height;
  }
});