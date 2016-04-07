import Controller from 'babel!./controller';

export default class extends Controller {
  constructor() {
    super();
    this.direction = 0;
  }

  update(delay) {
    if (!this.active) return;
    if (Math.random() * 10 > 9) {
      this.direction = Math.floor(Math.random() * 4);
    }
    if (Math.random() * 10 > 5) {
      this.bomber.move(this.direction, 20);
    }
  }
}