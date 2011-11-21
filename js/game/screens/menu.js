define('screens/menu', ['screens/screen'], function() {
  Game.Screen.Menu = Class.create(Game.Screen, {
    counter: 0,
    name: 'Menu',
    menu: null,
    rendered: false,
    changed: false,
    init: function() {
      Game.Screen.Menu.instance = this;
      var Type = Game.Screen.Menu.Item.Type;
      var Item = Game.Screen.Menu.Item;

      this.menu = new Item('Root', Type.Inner)
        .addChild(new Item('New Game', Type.Inner)
          .addChild(new Item('Start Game', Type.Screen, Game.Screen.Arena))
          .addChild(new Item('Map Selection', Type.Screen, Game.Screen.Levels))
          .addChild(new Item('Player setup', Type.Screen, Game.Screen.Players))
          .addChild(new Item(null, Type.Settings, 'game.random_bombers_positions'))
          .addChild(new Item(null, Type.Settings, 'game.random_maps'))
          .addChild(new Item(null, Type.Settings, 'game.win_points'))
          .addChild(new Item(null, Type.Settings, 'game.round_time')))
        .addChild(new Item('Options', Type.Inner)
          .addChild(new Item('Start/Max Extras', Type.Inner)
            .addChild(new Item(null, Type.Settings, 'start.bombs'))
            .addChild(new Item(null, Type.Settings, 'start.power'))
            .addChild(new Item(null, Type.Settings, 'start.skateboards'))
            .addChild(new Item(null, Type.Settings, 'start.kick'))
            .addChild(new Item(null, Type.Settings, 'start.glove'))
            .addChild(new Item(null, Type.Settings, 'max.bombs'))
            .addChild(new Item(null, Type.Settings, 'max.power'))
            .addChild(new Item(null, Type.Settings, 'max.skateboards')))
          .addChild(new Item('Extras', Type.Inner)
            .addChild(new Item(null, Type.Settings, 'extras.bombs'))
            .addChild(new Item(null, Type.Settings, 'extras.power'))
            .addChild(new Item(null, Type.Settings, 'extras.skateboard'))
            .addChild(new Item(null, Type.Settings, 'extras.kick'))
            .addChild(new Item(null, Type.Settings, 'extras.glove')))
          .addChild(new Item('Diseases', Type.Inner)
            .addChild(new Item(null, Type.Settings, 'diseases.joint'))
            .addChild(new Item(null, Type.Settings, 'diseases.viagra'))
            .addChild(new Item(null, Type.Settings, 'diseases.cocaine')))
          .addChild(new Item('Timing &amp; Speed', Type.Inner)
            .addChild(new Item(null, Type.Settings, 'timing.bombs.countdown'))
            .addChild(new Item(null, Type.Settings, 'timing.bombs.chain_reaction'))
            .addChild(new Item(null, Type.Settings, 'timing.bombs.moving_speed')))
          .addChild(new Item('Graphic Options', Type.Inner)
            .addChild(new Item(null, Type.Settings, 'graphic.theme', function(theme) {
              Game.instance.setTheme(theme);
             }))
            .addChild(new Item(null, Type.Settings, 'graphic.shadows', function(value) {
              if (value) {
                Game.instance.container.addClassName('shadows');
              } else {
                Game.instance.container.removeClassName('shadows');
              }
            }))
            .addChild(new Item(null, Type.Settings, 'graphic.maxfps', function(fps) {
              Game.instance.graphics.fps = fps;
            }))
            .addChild(new Item(null, Type.Settings, 'graphic.kidz'))
            .addChild(new Item(null, Type.Settings, 'graphic.corpse_parts'))
            .addChild(new Item(null, Type.Settings, 'graphic.shaky_explosions')))
          .addChild(new Item(null, Type.Settings, 'sounds', function(value) {
            Sound.setEnabled(value);
          }))
          .addChild(new Item(null, Type.Settings, 'debug', function(value) {
            if (value) {
              document.onmousedown = function() {return true}; // disable text selection - chromium
              document.oncontextmenu = function() {return true}; // disable context menu
              Game.instance.drawThemesSwitcher();
            } else {
              $('theme-switcher').remove();
              document.onmousedown = function() {return false}; // disable text selection - chromium
              document.oncontextmenu = function() {return false}; // disable context menu
            }
          })))
      .addChild(new Item('Editor', Type.Screen, Game.Screen.Editor))
      .addChild(new Item('Credits', Type.Screen, Game.Screen.Credits))
      .addChild(new Item('Help', Type.Screen, Game.Screen.Help))
      .addChild(new Item('Quit Game', Type.Inner)
        .addChild(new Item('Yes', Type.Custom, function() {
          window.open('', '_self', '');
          window.close();
        }))
        .addChild(new Item('No', Type.Custom, function(item) {
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
            case Event.KEY_LEFT:
              this.act(null, false);
              break;
            case Event.KEY_RIGHT:
              this.act(null, true);
              break;
            case Event.KEY_ENTER || 13:
              this.act(null, true);
              break;
            case Event.KEY_BACKSPACE:
              this.act(null, false);
              break;
            case Event.KEY_ESC:
              this.changeMenu(this.menu.getParent());
              break;
          }
        }.bind(this)
      };
      Sound.play('whoosh');
      this.prerender();
    },
    dispatch: function($super) {
      if (this.list) {
        this.list.remove();
        this.rendered = false;
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
    prerender: function() {
      if (!this.rendered) {
        this.rendered = true;
        this.renderMenu(this.menu, this.container);
      }
    },
    render: function() {
      var self = this;
      if (this.changed) {
        this.changed = false;
        if (this.list) {
          this.list.remove();
        }
        this.renderMenu(this.menu, this.container);
      }
    },
    renderMenu: function(menu, container) {
      this.list = new Element('ul', {id: 'menu'});
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
    act: function(item, direct) {
      try {
        (item || this.getSelected()).execute(direct);
      } catch (e) {
        this.selectNext();
        this.act(null, direct);
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
      this.type = type;
      this.args = $A(arguments).slice(2);

      if (type === Game.Screen.Menu.Item.Type.Settings) {
        this.label = Config.getProperty(this.args[0]).getName();
      } else {
        this.label = label;
      }
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
        if (!this.li.hasClassName('selected')) {
          Sound.play('break');
          this.li.addClassName('selected');
        }
      } else {
        this.li.removeClassName('selected');
      }
      this.selected = selected;
    },
    getLabel: function() {
      if (this.type === Game.Screen.Menu.Item.Type.Settings) {
        var property = Config.getProperty(this.args[0]);
        if (property.type == 'boolean') {
          this.label;
        } else {
          return this.label + ' - ' + property.getScreenValue();
        }
      }
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
      if (Object.isUndefined(list)) {
        this.li.update(this.getLabel());
      } else {
        this.li = new Element('li').update(this.getLabel());
        this.li.observe('click', function() {
          this.execute(true);
        }.bind(this));
        this.li.observe('mouseover', function() {
          this.setSelected(true);
        }.bind(this));
        this.li.observe('mousemove', function() {
          this.setSelected(true);
        }.bind(this));
        this.li.observe('mouseout', function() {
          this.setSelected(false);
        }.bind(this));

        if (this.getType() === Game.Screen.Menu.Item.Type.Inner) {
          this.li.addClassName('submenu');
        }

        if (this.isSelected()) {
          this.li.addClassName('selected');
        }
        list.appendChild(this.li);
      }
      if (this.type === Game.Screen.Menu.Item.Type.Settings) {
        this.li.className = '';
        if (this.isSelected()) {
          this.li.addClassName('selected');
        }
        this.li.addClassName('value-' + Config.getProperty(this.args[0]).getScreenValue());
      }
    },
    toString: function() {
      return 'Menu item {' + this.label + ', ' + this.depth + '}';
    },
    execute: function(direct) {
      this.type(this, direct, this.args);
    },
    size: function() {
      return this.children.length;
    }
  });

  Game.Screen.Menu.Item.Type = {
    Screen: function(item, direct, args) {
      Sound.play('clear');
      Game.instance.setScreen(args[0]);
    },
    Inner: function(item) {
      Game.instance.getScreen().changeMenu(item);
    },
    Settings: function(item, direct,  args) {
      Sound.play('break');
      var key = args[0];
      var value = Config.change(key, direct);
      if (Object.isFunction(args[1])) {
        args[1](value);
      }
      item.render();
    },
    Custom: function(item, direct, args) {
      args[0](item);
    }
  };
});

