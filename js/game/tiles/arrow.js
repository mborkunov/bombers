import Ground from 'babel!./ground';

export default class Arrow extends Ground {
  constructor(location, direction) {
    super(location);
    this.name = 'arrow';
    this.direction = Arrow.getDirection(direction)
  }

  getName() {
    return this.name.toLowerCase() + ' ' + Arrow.getDirectionName(this.direction);
  }

  static getDirection(ch) {
    var direction = -1;
    switch (ch) {
      case '^':
        direction = 0;
        break;
      case '>':
        direction = 1;
        break;
      case 'v':
        direction = 2;
        break;
      case '<':
        direction = 3;
        break;
    }
    return direction;
  }

  static getDirectionName(direction) {
    var name;
    switch (direction) {
      case 0:
        name = 'north';
        break;
      case 1:
        name = 'east';
        break;
      case 2:
        name = 'south';
        break;
      case 3:
        name = 'west';
        break;
    }
    return name;
  }
}