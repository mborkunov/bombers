import Extra from 'babel!./extra';

export default class Skateboard extends Extra {

  constructor(location) {
    super('skateboard', location);
  }

  act(bomber) {
    bomber.setSpeed(bomber.getSpeed() + Skateboard.getSpeed());
  }

  static getSpeed() {
    return .05;
  }
}