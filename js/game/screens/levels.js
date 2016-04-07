import Screen from 'babel!./screen';
import Menu from 'babel!./menu';

export default class Level extends Screen {
  constructor(container, callback) {
    super('levels', container);
    this.rendered = false;
    this.listeners = {
      click: function() {
      },
      keydown: function(e) {
        if (e.keyCode == 27 || e.keyCode == 13) {
          callback(Menu);
        }
      }.bind(this)
    };
  }

  dispatch() {
  }

  update() {
  }

  render() {
    if (!this.rendered) {
      this.rendered = true;
    }
  }
}