import Ground from 'babel!./ground';

export default class Arrow extends Ground {

  constructor(location, directionCharacter) {
    super(location);
    this.direction = Arrow.getDirection(directionCharacter);
    this.name = 'arrow ' + Arrow.getDirectionName(this.direction);
  }

  static getDirection(ch) {
    return ['^', '>', 'v', '<'].indexOf(ch);
  }

  static getDirectionName(direction) {
    return ['north', 'east', 'south', 'west'][direction];
  }
}