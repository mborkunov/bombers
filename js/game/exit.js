var Exit = Class.create(Screen, {
    menu: null,
    name: "Exit",
    rendered: false,
    init: function() {
        this.rendered = false;
        this.menu = new Menu()
            .addItem(new MenuItem("Yes", function() {
                window.close();
            }))
                .addItem(new MenuItem("No", function() {
                this.game.setScreen(new Start());
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
    listeners: {
        mousemove: function(e) {
        },
        keydown: function(e) {
        }
    },
    dispatch: function() {
       this.menu.dispatch();
       this.rendered = false;
    }
});
