define('objects/extras/extra', [], function() {
  Game.Object.Extra = Class.create(Game.Object, {
    name: null,
    element: null,
    initialize: function($super, location) {
      $super();
      this.location = location;
    },
    render: function($super) {
      if (!this.element) {
        this.element = new Element('div').setStyle({
          top: this.location.getY() * 40 + 'px',
          left: this.location.getX() * 40 + 'px'
        }).addClassName('extra').addClassName('extra-' + this.name);
        Game.instance.screen.battleField.appendChild(this.element);
      }
      $super();
    }
  });
});
