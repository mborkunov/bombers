define('objects/extras/extra', [], function() {
  Game.Object.Extra = Class.create(Game.Object, {
    name: null,
    element: null,
    tile: null,
    initialize: function($super, location) {
      $super();
      this.tile = null;
      this.location = location;
    },
    render: function($super) {
      if (!this.element) {
        this.element = new Element('div').setStyle({
          top: this.location.getY() * 40 + 'px',
          left: this.location.getX() * 40 + 'px'
        }).addClassName('extra').addClassName('extra-' + this.name);
        this.element.observe('click', function() {
          this.remove();
        }.bind(this));
        Game.instance.screen.battleField.appendChild(this.element);
      }
      $super();
    },
    act: function() {},
    remove: function() {
      this.tile.extra = null;
      this.tile = null;
      var extras = Game.instance.screen.objects.extras;
      extras = extras.without(this);
      this.dispatch();
    },
    dispatch: function() {
      this.element.remove();
    }
  });
});
