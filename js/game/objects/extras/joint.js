import Disease from 'babel!./disease';

export default class Cocaine extends Disease {

  constructor(location) {
    super('joint', location);
  }
}