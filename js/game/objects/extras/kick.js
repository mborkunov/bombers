define('objects/extras/kick', ['objects/extras/extra'], function() {
  Game.Object.Extra.Kick = Class.create(Game.Object.Extra, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'kick';
    }
  });
});
