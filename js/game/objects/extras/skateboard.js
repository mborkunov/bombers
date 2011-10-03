define('objects/extras/skateboard', ['objects/extras/extra'], function() {
  Game.Object.Extra.Skateboard = Class.create(Game.Object.Extra, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'skateboard';
    },
    act: function(bomber) {
      bomber.setSpeed(bomber.getSpeed() + Game.Object.Extra.Skateboard.getSpeed());
    }
  });

  Object.extend(Game.Object.Extra.Skateboard, {
    getSpeed: function() {
      return .05;
    }
  })
});