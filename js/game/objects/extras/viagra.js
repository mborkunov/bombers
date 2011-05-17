define('objects/extras/viagra', ['objects/extras/disease'], function() {
  Game.Object.Extra.Viagra = Class.create(Game.Object.Extra.Disease, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'viagra';
    }
  });
});
