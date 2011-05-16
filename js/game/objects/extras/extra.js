var Extra = Class.create(GameObject, {
  name: null,
  element: null,
  initialize: function($super, location) {
    $super();
    console.log(arguments);
    this.location = location;
  },
  render: function() {
    if (!this.element) {
      this.element = new Element('div').setStyle({
        top: this.location.getY() * 40 + 'px',
        left: this.location.getX() * 40 + 'px'
      }).addClassName('extra').addClassName('extra-' + this.name);
      Game.instance.screen.battleField.appendChild(this.element);
    }
  }
});