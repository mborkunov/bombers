import Tile from 'babel!./tile';

export default class None extends Tile {

  constructor(location) {
    super('none', location);
    this.passable = true;
    this.type = 0;
  }

  act(object) {
    object.fall();
  }

  prerender() {
  }

  render() {
  }

  update() {
  }
}