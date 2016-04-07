import Extra from 'babel!./extra';

export default class Glove extends Extra {

  constructor(location) {
    super('glove', location);
  }

  act(bomber) {
    bomber.canThrow = true;
  }
}