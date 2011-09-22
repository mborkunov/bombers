define('objects/extras/power', ['objects/extras/extra'], function() {
  Game.Object.Extra.Power = Class.create(Game.Object.Extra, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'power';
    },
    act: function(bomber) {
      bomber.power++;
    }
  });
});
