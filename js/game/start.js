var Start = Class.create(Screen, {
     counter: 0,
     name: "Start",
     menu: null,
     rendered: false,
     init: function() {
         var handler = function(item) {console.log(item.getName())};
         this.menu = new Menu()
              .addItem(new MenuItem("Start", function() {
                  Game.instance.setScreen(Battle);
              }))
              .addItem(new MenuItem("Options", function() {
                  Game.instance.setScreen(Options);
              }))
              .addItem(new MenuItem("Exit", function() {
                  Game.instance.setScreen(Exit);
              }));
         this.listeners = {
             mousemove: function(e) {
             },
             keydown: function(e) {
             },
             keyup: function(e) {
             }
         };
     },
     dispatch: function($super) {
         this.menu.dispatch();
         //$super();
     },
     update: function() {
     },
     render: function(time) {
        if (!this.rendered) {
            this.rendered = true;
            this.menu.render(this.container);
        }
     }
});
