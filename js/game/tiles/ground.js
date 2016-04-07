import Tile from 'babel!./tile';

export default class Ground extends Tile {
  constructor(location) {
    super('ground', location);
    this.passable = true;
  }

  hasExtra() {
    return this.extra != null;
  }

  getExtra() {
    return this.extra;
  }
}