var Start = Class.create(Screen, {
     counter: 0,
     name: "Start",
     menu: null,
     rendered: false,
     init: function() {
         var handler = function(item) {console.log(item.getName())};
         this.menu = new Menu()
              .addItem(new MenuItem("Start", function() {
                  Game.instance.setScreen(new Battle());
              }))
              .addItem(new MenuItem("Options", function() {
                  Game.instance.setScreen(new Options());
              }))
              .addItem(new MenuItem("Exit", function() {
                  Game.instance.setScreen(new Exit());
              }));
         this.listeners = {
             mousemove: function(e) {
             },
             keydown: function(e) {
                 console.log("Start down listener: " + e);
             },
             keyup: function(e) {
                 console.log("Start up listener: " + e);
             }
         };
     },
     dispatch: function() {
         this.menu.dispatch();
         this.rendered = false;
     },
     update: function() {
     },
     render: function(time) {
        if (!this.rendered) {
            this.rendered = true;
            this.menu.render(this.container);
        }
         /*var r = Math.floor(Math.random() * 255);
         var g = Math.floor(Math.random() * 255);
         var b = Math.floor(Math.random() * 255);
         var a = Math.floor(Math.random() * 255);

         var block = new Element("div").update(this.counter++ + " -  Hello, world!!! ").setStyle({
             background: "rgba(" + r + ", " + g + ", " + b + ", " + a + ")"
         });*/
         //this.container.appendChild(block);
         //window.scrollTo(0, 100000000);
     }
});
