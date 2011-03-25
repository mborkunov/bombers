var Exit = Class.create(Screen, {
    menu: null,
    name: 'Exit',
    rendered: false,
    init: function() {
      this.listeners = {
          mousemove: function(e) {
          },
          keydown: function(e) {
            if (e.keyCode == Event.KEY_ESC) {
              Game.instance.setScreen(Menu);
            }
          }
      };
      this.rendered = false;
      this.menu = new Menu()
          .addItem(new MenuItem('Yes', function() {
            window.close();
          }))
          .addItem(new MenuItem('No', function() {
              this.game.setScreen(Menu);
          }.bind(this)));
    },
    update: function() {
    },
    render: function(time) {
        if (!this.rendered) {
            this.rendered = true;
            this.menu.render(this.container);
        }
    },
    listeners: {},
    dispatch: function() {
       this.menu.dispatch();
       this.rendered = false;
    }
});
