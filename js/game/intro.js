var Intro = Class.create(Screen, {
     counter: 0,
     name: "Intro",
     menu: null,
     rendered: false,
     opacity: 0,
     introElement: null,
     init: function() {
         this.container.appendChild(this.introElement = new Element("div").update("Web ClanBomber"));
         this.listeners = {
             click: function(e) {
               console.log("click event");
               Game.instance.setScreen(Start);
             },
             keydown: function(e) {
               console.log("key event");
               Game.instance.setScreen(Start);
             }
         };
     },
     dispatch: function($super) {
        $super();
     },
     update: function() {
       if (this.opacity >= 1) {
         Game.instance.setScreen(new Start());
       }
       this.opacity += 0.005;
     },
     render: function(time) {
        this.introElement.setStyle({
          opacity: this.opacity
        })
     }
});
