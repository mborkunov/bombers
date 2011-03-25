var Editor = Class.create(Screen, {
    name: 'Editor',
    rendered: false,
    listeners: null,
    init: function() {
      this.listeners = {
          mousemove: function(e) {
          },
          keydown: function(e) {
          }
      };
      this.rendered = false;
    },
    update: function() {
    },
    render: function(time) {
        if (!this.rendered) {
            this.rendered = true;
        }
    },
    dispatch: function($super) {
       $super();
    }
});
