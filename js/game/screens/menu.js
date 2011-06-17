define('screens/menu', ['screens/screen'], function() {
  Game.Screen.Menu = Class.create(Game.Screen, {
    counter: 0,
    name: 'Menu',
    menu: null,
    rendered: false,
    changed: false,
    init: function() {
      var Type = Game.Screen.Menu.Item.Type;
      var Item = Game.Screen.Menu.Item;

      this.menu = new Item("Root", Type.Inner)
        .addChild(new Item("New Game", Type.Screen, Game.Screen.Arena))
        .addChild(new Item("Options", Type.Inner)
            .addChild(new Item("Start/Max Extras", Type.Inner)
              .addChild(new Item("Start Bombs", Type.Settings))
              .addChild(new Item("Start Power", Type.Settings))
              .addChild(new Item("Start Skateboards", Type.Settings))
              .addChild(new Item("Start Kick", Type.Settings))
              .addChild(new Item("Start Glove", Type.Settings))
              .addChild(new Item("Max. Bombs", Type.Settings))
              .addChild(new Item("Max. Power", Type.Settings))
              .addChild(new Item("Max. Skateboards", Type.Settings)))
            .addChild(new Item("Enable/Disable Extras", Type.Inner)
              .addChild(new Item("Bombs", Type.Settings))
              .addChild(new Item("Power", Type.Settings))
              .addChild(new Item("Skateboard", Type.Settings))
              .addChild(new Item("Kick", Type.Settings))
              .addChild(new Item("Glove", Type.Settings)))
            .addChild(new Item("Enable/Disable Diseases", Type.Inner)
              .addChild(new Item("Joint", Type.Settings))
              .addChild(new Item("Viagra", Type.Settings))
              .addChild(new Item("Cocaine", Type.Settings)))
            .addChild(new Item("Bomb Timing and Speed", Type.Inner)
              .addChild(new Item("Bomb Countdown (1/10 s)", Type.Settings))
              .addChild(new Item("Bomb Chain Reaction Delay (1/100 s)", Type.Settings))
              .addChild(new Item("Moving Bombs Speed", Type.Settings)))
            .addChild(new Item("Graphic Options", Type.Inner)
              .addChild(new Item("Kidz Mode", Type.Settings))
              .addChild(new Item("Corpse Parts", Type.Settings))
              .addChild(new Item("Shaky Explosions", Type.Settings))))
        .addChild(new Item("Editor", Type.Screen, Game.Screen.Editor))
        .addChild(new Item("Credits", Type.Screen, Game.Screen.Credits))
        .addChild(new Item("Help", Type.Screen, Game.Screen.Help))
        .addChild(new Item("Quit Game", Type.Inner)
          .addChild(new Item("Yes", Type.Custom, function() {
            window.open('', '_self', '');
            window.close();
          }))
          .addChild(new Item("No", Type.Custom, function(item) {
            this.changeMenu(item.getParent().getParent());
          }.bind(this)))
        );

      this.listeners = {
        mousemove: function(e) {
        },
        keydown: function(e) {
        },
        keyup: function(e) {
          switch (e.keyCode) {
            case Event.KEY_DOWN:
              this.selectNext();
              break;
            case Event.KEY_UP:
              this.selectPrev();
              break;
            case Event.KEY_ENTER || 13:
              this.act();
              break;
            case Event.KEY_ESC:
              this.changeMenu(this.menu.getParent());
              break;
          }
        }.bind(this)
      };
      Sound.play('whoosh');
    },
    dispatch: function($super) {
      if (this.list) {
        this.list.remove();
      }
    },
    changeMenu: function(item) {
      if (item == null) return;
      this.menu = item;
      this.changed = true;
      Sound.play('whoosh');
    },
    update: function() {
    },
    render: function(time) {
      var self = this;
      if (!this.rendered) {
        this.rendered = true;
        this.renderMenu(this.menu, this.container);
      }

      if (this.changed) {
        this.changed = false;
        if (this.list) {
          this.list.remove();
        }
        this.renderMenu(this.menu, this.container);
      }
    },
    renderMenu: function(menu, container) {
      this.list = new Element("ul", {id: "menu"});
      menu.getChildren().each(function(list, item) {
        item.render(list);
      }.bind(this, this.list));
      container.appendChild(this.list);
    },
    selectNext: function() {
      var selected = this.getSelected();
      var position = this.getPosition();
      if (selected == null) {
        selected = this.menu.getChildren()[0];
        selected.setSelected(true);
      } else {
        if (position + 1 < this.menu.size()) {
          selected.setSelected(false);
          this.getMenuItem(position + 1).setSelected(true);
        }
      }
    },
    getPosition: function() {
      return this.menu.getChildren().indexOf(this.getSelected());
    },
    getMenuItem: function(position) {
      return this.menu.getChildren()[position];
    },
    selectPrev: function() {
      var selected = this.getSelected();
      var position = this.getPosition();
      if (selected == null) {
        selected = this.menu.getChildren()[this.menu.length - 1];
        selected.setSelected(true);
      } else {
        if (position - 1 >= 0) {
          selected.setSelected(false);
          this.getMenuItem(position - 1).setSelected(true);
        }
      }
    },
    getSelected: function() {
      var rs = null;
      this.menu.getChildren().each(function(item) {
        if (item.isSelected()) {
          rs = item;
        }
      });
      return rs;
    },
    act: function(item) {
      try {
        (item || this.getSelected()).execute();
      } catch (e) {
        this.selectNext();
        this.act();
      }
    }
  });

  Game.Screen.Menu.Item = Class.create({
    children: null,
    label: null,
    type: null,
    selected: false,
    depth: 0,
    li: null,
    parent: null,
    initialize: function(label, type) {
      this.label = label;
      this.type = type;
      this.args = $A(arguments).slice(2);
      this.clearChildren();
    },
    setDepth: function(depth) {
      this.depth = depth;
    },
    isSelected: function() {
      return this.selected;
    },
    setSelected: function(selected) {
      if (selected) {
        if (!this.li.hasClassName("selected")) {
          Sound.play('break');
          this.li.addClassName("selected");
        }
      } else {
        this.li.removeClassName("selected");
      }
      this.selected = selected;
    },
    getLabel: function() {
      return this.label;
    },
    getType: function() {
      return this.type;
    },
    setParent: function(parent) {
      this.parent = parent;
    },
    getParent: function() {
      return this.parent;
    },
    addChild: function(child) {
      child.setDepth(this.depth + 1);
      child.setParent(this);
      this.children.push(child);
      return this;
    },
    setChildren: function(children) {
      if (children instanceof Array) {
        this.children = children;
        this.children.each(function(child) {
          child.setDepth(this.depth + 1);
        }.bind(this));
        return true;
      }
      return false;
    },
    getChildren: function() {
      return this.children;
    },
    clearChildren: function() {
      this.children = [];
    },
    render: function(list) {
      this.li = new Element("li").update(this.getLabel());
      this.li.observe("click", function() {
        this.execute()
      }.bind(this));
      this.li.observe("mouseover", function() {
        this.setSelected(true)
      }.bind(this));
      this.li.observe("mousemove", function() {
        this.setSelected(true)
      }.bind(this));
      this.li.observe("mouseout", function() {
        this.setSelected(false)
      }.bind(this));

      if (this.isSelected()) {
        this.li.addClassName("selected");
      }
      list.appendChild(this.li);
    },
    toString: function() {
      return "Menu item {" + this.label + ", " + this.depth + "}";
    },
    execute: function() {
      this.type(this, this.args);
    },
    size: function() {
      return this.children.length;
    }
  });

  Game.Screen.Menu.Item.Type = {
    Screen: function(item, args) {
      Sound.play('clear');
      Game.instance.setScreen(args[0]);
    },
    Inner: function(item) {
      Game.instance.getScreen().changeMenu(item);
    },
    Settings: function(item, args) {
      console.log(item, args);
    },
    Custom: function(item, args) {
      args[0](item);
    }
  };
});

