var Point = Class.create({
  x: null,
  y: null,
  changed: false,
  initialize: function(x, y) {
    this.x = x;
    this.y = y;
    this.changed = true;
  },
  getX: function() {
    return this.x;
  },
  getY: function() {
    return this.y;
  },
  setX: function(x) {
    this.x = x;
    this.changed = true;
  },
  setY: function(y) {
    this.y = y;
    this.changed = true;
  },
  increaseX: function(delta) {
    this.x += delta;
    this.changed = true;
  },
  increaseY: function(delta) {
    this.y += delta;
    this.changed = true;
  },
  increase: function(deltaX, deltaY) {
    this.x += deltaX;
    this.y += deltaY;
    this.changed = true;
  },
  roundX: function() {
    return new Point(Math.round(this.x), this.y);
  },
  roundY: function() {
    return new Point(this.x, Math.round(this.y));
  },
  shift: function(offset, direction) {
    var point = this.clone();
    switch (direction) {
      case 0:
          point.y -= offset;
        break;
      case 1:
          point.x += offset;
        break;
      case 2:
          point.y += offset;
        break;
      case 3:
          point.x -= offset;
        break;
    }
    return point;
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
  },
  isChanged: function() {
    return this.changed;
  },
  setChanged: function(flag) {
    this.changed = flag;
  }
});

Point.prototype.toString = function() {
  return 'Point{x:' + this.x + ', y:' + this.y + '}';
};