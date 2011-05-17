define('objects/extras/skateboard', ['objects/extras/extra'], function() {
  Game.Object.Extra.Skateboard = Class.create(Game.Object.Extra, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'skateboard';
    }
  });
});
