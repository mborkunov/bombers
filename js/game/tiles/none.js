Tile.None = Class.create(Tile, {
  initialize: function($super, location) {
    $super(location);
    this.name = 'none';
    this.passable = true;
    this.type = 0;
  },
  act: function(object) {
    object.fall();
  },
  prerender: function() {
  },
  render: function() {
  },
  update: function() {
  }
});
