var Menu = Class.create(Screen, {
     counter: 0,
     name: 'Menu',
     menu: null,
     rendered: false,
     init: function() {
         var handler = function(item) {console.log(item.getName())};
         this.menu = new MenuTree()
              .addItem(new MenuItem('New Game', function() {
                  Game.instance.setScreen(Arena);
              }))
              .addItem(new MenuItem('Options', function() {
                  Game.instance.setScreen(Options);
              }))
              .addItem(new MenuItem('Map Editor', function() {
                  Game.instance.setScreen(Editor);
              }))
              .addItem(new MenuItem('Show Credits', function() {
                  Game.instance.setScreen(Credits);
              }))
              .addItem(new MenuItem('Help Screen', function() {
                  Game.instance.setScreen(Help);
              }))
              .addItem(new MenuItem('Quit Game', function() {
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
