define('objects/extras/glove', ['objects/extras/extra'], function() {
  Game.Object.Extra.Glove = Class.create(Game.Object.Extra, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'glove';
    }
  });
});
