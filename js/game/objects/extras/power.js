import Extra from 'babel!./extra';

export default class Power extends Extra {

  constructor(location) {
    super('power', location);
  }

  act(bomber) {
    bomber.power++;
  }
}