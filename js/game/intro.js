var Intro = Class.create(Screen, {
     counter: 0,
     name: 'Intro',
     menu: null,
     rendered: false,
     opacity: 0,
     introElement: null,
     init: function() {
         this.container.appendChild(this.introElement = new Element('div').update('Web ClanBomber'));
         this.listeners = {
             click: function(e) {
               Game.instance.setScreen(Menu);
             },
             keydown: function(e) {
               Game.instance.setScreen(Menu);
             }
         };
         Sound.play('winlevel');
     },
     dispatch: function($super) {
        $super();
     },
     update: function() {
       if (this.opacity >= 1) {
         Game.instance.setScreen(new Menu());
       }
       this.opacity += 0.015;
     },
     render: function(time) {
        this.introElement.setStyle({
          opacity: this.opacity
        })
     }
});
