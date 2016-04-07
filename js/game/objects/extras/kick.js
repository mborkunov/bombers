import Extra from 'babel!./extra';

export default class Kick extends Extra {

  constructor(location) {
    super('kick', location);
  }

  act(bomber) {
    bomber.canKick = true;
  }
}