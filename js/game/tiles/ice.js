import Ground from 'babel!./ground';

export default class Ice extends Ground {
  constructor(location) {
    super(location);
    this.name = 'ice';
  }
}