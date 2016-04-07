import Extra from 'babel!./extra';

export default class Bomb extends Extra {
  constructor(location) {
    super('bomb', location);
  }

  act(bomber) {
    bomber.maxBombs++;
  }
}