define('objects/extras/cocaine', ['objects/extras/disease'], function() {
  Game.Object.Extra.Cocaine = Class.create(Game.Object.Extra.Disease, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'cocaine';
    }
  });
});
