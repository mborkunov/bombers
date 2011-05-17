define('controllers/controller', [], function() {
  Game.Controller = Class.create({

    active: null,
    reverse: null,
    autoShoot: null,
    bomber: null,

    initialize: function() {
      this.active = true;
      this.reverse = false;
      this.autoShoot = false;
    },
    attach: function(bomber) {
      this.bomber = bomber;
    },
    revert: function() {
      this.reverse = !this.reverse;
    },
    setAutoShoot: function(autoShoot) {
      this.autoShoot = autoShoot;
    },
    activate: function() {
      this.active = true;
    },
    deactivate: function() {
      this.active = false;
    },
    update: function() {
    }
  });
});
