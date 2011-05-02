var Menu = Class.create(Screen, {
  counter: 0,
  name: 'Menu',
  menu: null,
  level: 0,
  rendered: false,
  init: function() {
    /*this.menu = new MenuTree()
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
    }));*/

    var Type = Menu.Item.Type;
    this.menu = [
        new Menu.Item("New Game", Type.Screen, Arena),
        new Menu.Item("Options", Type.Screen, Options),
        new Menu.Item("Editor", Type.Screen, Editor),
        new Menu.Item("Credits", Type.Screen, Credits),
        new Menu.Item("Help", Type.Screen, Help),
        new Menu.Item("Quit Game", Type.Screen, Exit)
    ];

    this.listeners = {
      mousemove: function(e) {
      },
      keydown: function(e) {

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
        }
      }.bind(this),
      keyup: function(e) {
      }
    };
    Sound.play('whoosh');
  },
  dispatch: function($super) {
    if (this.list) {
      this.list.remove();
    }
  },
  update: function() {
  },
  render: function(time) {
    var self = this;
    if (!this.rendered) {
      this.rendered = true;
      this.list = new Element("ul", {id: "menu"});
      this.menu.each(function(list, item) {
        item.render(list);
      }.bind(this, this.list));
      this.container.appendChild(this.list);
    }
  },
  selectNext: function() {
    var selected = this.getSelected();
    var position = this.getPosition();
    if (selected == null) {
      selected = this.menu[0];
      selected.setSelected(true);
    } else {
      if (position + 1 < this.menu.length) {
        selected.setSelected(false);
        this.getMenuItem(position + 1).setSelected(true);
      }
    }
  },
  getPosition: function() {
    return this.menu.indexOf(this.getSelected());
  },
  getMenuItem: function(position) {
    return this.menu[position];
  },
  selectPrev: function() {
    var selected = this.getSelected();
    var position = this.getPosition();
    if (selected == null) {
      selected = this.menu[this.menu.length - 1];
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
    this.menu.each(function(item) {
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

Menu.Item = Class.create({
  children: null,
  label: null,
  type: null,
  selected: false,
  depth: 0,
  li: null,
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
  addChild: function(child) {
    child.setDepth(this.depth + 1);
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
    this.li.observe("click", function() {this.execute()}.bind(this));
    this.li.observe("mouseover", function() {this.setSelected(true)}.bind(this));
    this.li.observe("mousemove", function() {this.setSelected(true)}.bind(this));
    this.li.observe("mouseout", function() {this.setSelected(false)}.bind(this));

    list.appendChild(this.li);
  },
  toString: function() {
    return "Menu item {" + this.label + ", " + this.depth + "}";
  },
  execute: function() {
    this.type(this.args);
  }
});

Menu.Item.Type = {
  Screen: function(args) {
    Sound.play('clear');
    Game.instance.setScreen(args[0]);
  },
  Settings: function(arguments) {
  },
  Custom: function(args) {
    args[0]();
  }
};