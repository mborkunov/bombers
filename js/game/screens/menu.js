import Screen from 'babel!./screen';
import Sound from 'babel!../../sound';
import Config from 'babel!../../config';
import * as screens from 'babel!../screens';

export default class Menu extends Screen {

  constructor(container, callback) {
    super('menu', container);

    this.menu = new Item('Root', Type.Inner, this)
      .addChild(new Item('New Game', Type.Inner, this)
        .addChild(new Item('Choose Level', Type.Screen, screens.Levels, callback))
        .addChild(new Item('Player setup', Type.Screen, screens.Players, callback))
        .addChild(new Item(null, Type.Settings, 'game.random_bombers_positions'))
        .addChild(new Item(null, Type.Settings, 'game.random_maps'))
        .addChild(new Item(null, Type.Settings, 'game.win_points'))
        .addChild(new Item(null, Type.Settings, 'game.round_time')))
      .addChild(new Item('Options', Type.Inner, this)
        .addChild(new Item('Start/Max Extras', Type.Inner, this)
          .addChild(new Item(null, Type.Settings, 'start.bombs'))
          .addChild(new Item(null, Type.Settings, 'start.power'))
          .addChild(new Item(null, Type.Settings, 'start.skateboards'))
          .addChild(new Item(null, Type.Settings, 'start.kick'))
          .addChild(new Item(null, Type.Settings, 'start.glove'))
          .addChild(new Item(null, Type.Settings, 'max.bombs'))
          .addChild(new Item(null, Type.Settings, 'max.power'))
          .addChild(new Item(null, Type.Settings, 'max.skateboards')))
        .addChild(new Item('Extras', Type.Inner, this)
          .addChild(new Item(null, Type.Settings, 'extras.bombs'))
          .addChild(new Item(null, Type.Settings, 'extras.power'))
          .addChild(new Item(null, Type.Settings, 'extras.skateboard'))
          .addChild(new Item(null, Type.Settings, 'extras.kick'))
          .addChild(new Item(null, Type.Settings, 'extras.glove')))
        .addChild(new Item('Diseases', Type.Inner, this)
          .addChild(new Item(null, Type.Settings, 'diseases'))
          .addChild(new Item(null, Type.Settings, 'diseases.joint'))
          .addChild(new Item(null, Type.Settings, 'diseases.viagra'))
          .addChild(new Item(null, Type.Settings, 'diseases.cocaine')))
        .addChild(new Item('Timing &amp; Speed', Type.Inner, this)
          .addChild(new Item(null, Type.Settings, 'timing.bombs.countdown'))
          .addChild(new Item(null, Type.Settings, 'timing.bombs.chain_reaction'))
          .addChild(new Item(null, Type.Settings, 'timing.bombs.moving_speed')))
        .addChild(new Item('Graphic Options', Type.Inner, this)
          .addChild(new Item(null, Type.Settings, 'graphic.theme'))
          .addChild(new Item(null, Type.Settings, 'graphic.shadows'))
          .addChild(new Item(null, Type.Settings, 'graphic.maxfps'))
          .addChild(new Item(null, Type.Settings, 'graphic.kidz'))
          .addChild(new Item(null, Type.Settings, 'graphic.corpse_parts'))
          .addChild(new Item(null, Type.Settings, 'graphic.shaky_explosions')))
        .addChild(new Item(null, Type.Settings, 'sounds'))
        .addChild(new Item(null, Type.Settings, 'debug')))
      .addChild(new Item('Editor', Type.Screen, screens.Editor, callback))
      .addChild(new Item('Credits', Type.Screen, screens.Credits, callback))
      .addChild(new Item('Help', Type.Screen, screens.Help, callback))
      .addChild(new Item('Quit Game', Type.Inner, this)
        .addChild(new Item('Yes', Type.Custom, function() {
          window.open('', '_self', '');
          window.close();
        }))
        .addChild(new Item('No', Type.Custom, function(item) {
          this.changeMenu(item.getParent().getParent());
        }.bind(this)))
      );

    Sound.play('whoosh');
    this.prerender();

    this.listeners = {
      mousemove: function(e) {
      },
      keydown: function() {
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
  }

  dispatch() {
    if (this.list) {
      this.list.remove();
      this.rendered = false;
    }
  }

  changeMenu(item) {
    if (item == null) return;
    this.menu = item;
    this.changed = true;
    Sound.play('whoosh');
  }

  update() {
  }

  prerender() {
    if (!this.rendered) {
      this.rendered = true;
      this.renderMenu(this.menu, this.container);
    }
  }

  render() {
    if (this.changed) {
      this.changed = false;
      if (this.list) {
        this.list.remove();
      }
      this.renderMenu(this.menu, this.container);
    }
  }

  renderMenu(menu, container) {
    this.list = new Element('ul', {id: 'menu'});
    menu.getChildren().each(function(list, item) {
      item.render(list);
    }.bind(this, this.list));
    container.appendChild(this.list);
  }

  selectNext() {
    var selected = this.getSelected();
    var position = this.getPosition();
    if (selected == null) {
      selected = this.menu.getChildren()[0];
      selected.setSelected(true);
    } else {
      if (position + 1 < this.menu.size) {
        selected.setSelected(false);
        this.getMenuItem(position + 1).setSelected(true);
      }
    }
  }

  getPosition() {
    return this.menu.getChildren().indexOf(this.getSelected());
  }

  getMenuItem(position) {
    return this.menu.getChildren()[position];
  }

  selectPrev() {
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
  }

  getSelected() {
    var rs = null;
    this.menu.getChildren().each(function(item) {
      if (item.isSelected()) {
        rs = item;
      }
    });
    return rs;
  }
  act(item, direct) {
    try {
      (item || this.getSelected()).execute(direct);
    } catch (e) {
      this.selectNext();
      this.act(null, direct);
    }
  }
}

class Item {

  constructor(label, type) {
    this.type = type;
    this.args = $A(arguments).slice(2);

    if (type === Type.Settings) {
      this.label = Config.getProperty(this.args[0]).getName();
    } else {
      this.label = label;
    }
    this.clearChildren();
  }
  setDepth(depth) {
    this.depth = depth;
  }
  isSelected() {
    return this.selected;
  }
  setSelected(selected) {
    if (selected) {
      if (!this.li.hasClassName('selected')) {
        Sound.play('break');
        this.li.addClassName('selected');
      }
    } else {
      this.li.removeClassName('selected');
    }
    this.selected = selected;
  }
  getLabel() {
    if (this.type === Type.Settings) {
      var property = Config.getProperty(this.args[0]);
      if (property.type == 'boolean') {
        return this.label;
      } else {
        return this.label + ' - ' + property.getScreenValue();
      }
    }
    return this.label;
  }
  getType() {
    return this.type;
  }
  setParent(parent) {
    this.parent = parent;
  }
  getParent() {
    return this.parent;
  }
  addChild(child) {
    child.setDepth(this.depth + 1);
    child.setParent(this);
    this.children.push(child);
    return this;
  }
  setChildren(children) {
    if (children instanceof Array) {
      this.children = children;
      this.children.each(function(child) {
        child.setDepth(this.depth + 1);
      }.bind(this));
      return true;
    }
    return false;
  }
  getChildren() {
    return this.children;
  }
  clearChildren() {
    this.children = [];
  }
  render(list) {
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

      if (this.getType() === Type.Inner) {
        this.li.addClassName('submenu');
      }

      if (this.isSelected()) {
        this.li.addClassName('selected');
      }
      list.appendChild(this.li);
    }
    if (this.type === Type.Settings) {
      this.li.className = '';
      if (this.isSelected()) {
        this.li.addClassName('selected');
      }
      this.li.addClassName('value-' + Config.getProperty(this.args[0]).getScreenValue());
    }
  }
  toString() {
    return 'Menu item {' + this.label + ', ' + this.depth + '}';
  }
  execute(direct) {
    this.type(this, direct, this.args);
  }
  get size() {
    return this.children.length;
  }
}

const Type = {
  Screen: function(item, direct, args) {
    Sound.play('clear');
    console.log(arguments);
    args[1](args[0]);
  },
  Inner: function(item, direct, args) {
    args[0].changeMenu(item);
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
