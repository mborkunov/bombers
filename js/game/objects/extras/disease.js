define('objects/extras/disease', ['objects/extras/extra'], function() {
  Game.Object.Extra.Disease = Class.create(Game.Object.Extra, {
    initialize: function($super, location) {
      $super(location);
    }
  });
});

