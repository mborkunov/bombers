var Point = Class.create({
  x: null,
  y: null,
  initialize: function(x, y) {
    this.x = x;
    this.y = y;
  },
  getX: function() {
    return this.x;
  },
  getY: function() {
    return this.y;
  },
  setX: function(x) {
    this.x = x;
  },
  increaseX: function(delta) {
    this.x += delta;
  },
  increaseY: function(delta) {
    this.y += delta;
  },
  increase: function(deltaX, deltaY) {
    this.x += deltaX;
    this.y += deltaY;
  },
  setY: function(y) {
    this.y = y;
  },
  roundX: function() {
    return new Point(Math.round(this.x), this.y);
  },
  roundY: function() {
    return new Point(this.x, Math.round(this.y));
  },
  shift: function(offset, direction) {
    switch (direction) {
      case 0:
          this.y -= offset;
        break;
      case 1:
          this.x += offset
        break;
      case 2:
          this.y += offset;
        break;
      case 3:
          this.x -= offset;
        break;
    }
    return this;
  },
  round: function() {
    return new Point(Math.round(this.x), Math.round(this.y));
  },
  clone: function() {
    return new Point(this.x, this.y);
  },
  equals: function(point) {
    if (!point || !(point instanceof Point)) {
      throw 'illegal argument: ' + point;
    }
    return this.x === point.getX() && this.y === point.getY();
  }
});

Point.prototype.toString = function() {
  return 'Point{x:' + this.x + ', y:' + this.y + '}';
};