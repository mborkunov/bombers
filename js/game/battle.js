var Battle = Class.create(Screen, {
    menu: null,
    name: "Battle",
    rendered: false,
    direction: null,
    x: null,
    y: null,
    area: null,
    paused: false,
    battleField: null,
    overlay: null,
    dialog: null,
    init: function() {
        this.x = 0;
        this.y = 0;
        this.area = {
            x: 16, y: 10
        };
        this.direction = 0;
        this.rendered = false;
        this.listeners = {
            mousemove: function(e) {
            },
            keydown: function(e) {
                if (this.keys.indexOf(e.keyCode) === -1) {
                    this.keys.push(e.keyCode);
                }
            }.bind(this),
            keyup: function(e) {
                if (this.keys.indexOf(e.keyCode) !== -1) {
                    this.keys = this.keys.without(e.keyCode);
                }

                if (e.keyCode == 27) {
                    this.paused = !this.paused;
                }
            }.bind(this)
        }
    },
    update: function() {
        if (this.paused) return;

        if (this.keys.indexOf(Event.KEY_UP) != -1) {
            this.y--;
        } else if (this.keys.indexOf(Event.KEY_DOWN) != -1) {
            this.y++;
        }

        if (this.keys.indexOf(Event.KEY_LEFT) != -1) {
            this.x--;
        } else if (this.keys.indexOf(Event.KEY_RIGHT) != -1) {
            this.x++;
        }

        var change = false;
        if (this.x < 0) {
            this.x = 0;
            change = true;
        } else if (this.x + 1 >= this.area.x) {
            this.x = this.area.x - 1;
            change = true;
        }
        if (this.y < 0) {
            this.y = 0;
            change = true;
        } else if (this.y + 1 >= this.area.y) {
            this.y = this.area.y - 1;
            change = true;
        }
        if (change) {
            this.changeDirection();
        }

        if (!change && Math.random() > 0.50) {
            this.changeDirection();
        }
    },
    changeDirection: function() {
        //this.position = Math.round(Math.random()*3);
    },
    render: function(time) {
        if (!this.rendered) {
            this.rendered = true;

            var x = this.area.x, y = this.area.y;
            var width = Math.round(this.container.getWidth() / x);
            var height = Math.round(this.container.getHeight() / y);

            this.battleField = new Element("div");
            for (var i = 0; i < y; i++) {
                for (var j = 0; j < x; j++) {
                    this.battleField.appendChild(new Element("div", {id: j + "x" + i}).setStyle({float: "left", width: width + "px", height: height + "px", background: "green"}).update(i + "x" + j));
                }
                this.battleField.appendChild(new Element("br"));
            }
            this.container.appendChild(this.battleField);
        } else {
            if (this.prev != null) {
                this.prev.setStyle({background: "green"});;
            }
            var obj = $(this.x + "x" + this.y);
            if (obj !== null) {
                this.prev = obj.setStyle({background: "red"});
            }
        }
        if (this.paused && !this.overlay) {
            this.overlay = new Element("div", {id: "overlay"});
            this.dialog = new Element("div").addClassName("dialog");
            this.dialog.appendChild(new Element("a").addClassName("action").update("Return to main menu").observe("click", function() {
                Game.instance.setScreen(Start);
            }));
            this.dialog.appendChild(new Element("a").addClassName("action").update("Cancel").observe("click", function() {
                this.paused = false;
            }.bind(this)));
            this.container.appendChild(this.overlay);
            this.container.appendChild(this.dialog);
        } else if (!this.paused && this.overlay) {
            this.container.removeChild(this.overlay);
            this.container.removeChild(this.dialog);
            this.overlay = null;
        }
    },
    dispatch: function() {
       this.rendered = false;
       this.container.removeChild(this.battleField);
       if (this.overlay) {
           this.container.removeChild(this.dialog);
           this.container.removeChild(this.overlay);
       }

    }
});


var OptionGroup = Class.create({
  container: null,
  name: null,
  initialize: function(name) {
    this.name = name;
    this.container = new Element("div");
  },
  render: function() {
    return this.container
  }
});
