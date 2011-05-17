define('objects/extras/joint', ['objects/extras/disease'], function() {
  Game.Object.Extra.Joint = Class.create(Game.Object.Extra.Disease, {
    initialize: function($super, location) {
      $super(location);
      this.name = 'joint';
    }
  });
});
