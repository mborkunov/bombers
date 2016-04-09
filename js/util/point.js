export default class Point {

  constructor(x, y) {
    this._x = x;
    this._y = y;
    this._changed = true;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  set x(x) {
    this._x = x;
    this._changed = true;
  }

  set y(y) {
    this._y = y;
    this._changed = true;
  }

  increaseX(delta) {
    this._x += delta;
    this._changed = true;
  }

  increaseY(delta) {
    this._y += delta;
    this._changed = true;
  }

  increase(deltaX, deltaY) {
    this._x += deltaX;
    this._y += deltaY;
    this._changed = true;
  }

  roundX() {
    return new Point(Math.round(this._x), this._y);
  }

  roundY() {
    return new Point(this._x, Math.round(this._y));
  }

  shift(offset, direction) {
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
  }

  distance(location) {
    return Math.sqrt(Math.pow(Math.abs(this._x - location.x), 2) + Math.pow(Math.abs(this._y - location.y), 2));
  }

  near(location, delta) {
    return this.distance(location) < delta;
  }

  round() {
    return new Point(Math.round(this._x), Math.round(this._y));
  }

  clone() {
    return new Point(this._x, this._y);
  }

  equals(point) {
    if (!point || !(point instanceof Point)) {
      throw 'Point.equals: illegal argument [' + point + ']';
    }
    return this._x === point.x && this._y === point.y;
  }

  get changed() {
    return this._changed;
  }
  set changed(flag) {
    this._changed = flag;
  }

  toString() {
    return 'Point{x:' + this._x + ', y:' + this._y + '}';
  }
}