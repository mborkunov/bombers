var Editor = Class.create(Screen, {
     name: 'Editor',
     rendered: false,
     init: function() {
         this.listeners = {
             click: function(e) {
             },
             keydown: function(e) {
               Game.instance.setScreen(Menu);
             }
         };
     },
     dispatch: function($super) {
        $super();
     },
     update: function(delay) {

     },
     render: function(delay) {

     }
});
