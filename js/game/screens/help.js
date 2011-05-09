var Help = Class.create(Screen, {
  name: 'Help',
  rendered: false,
  menu: null,
  drugs: null,
  init: function() {
    this.listeners = {
      click: function(e) {
      },
      keydown: function(e) {
          if (e.keyCode == 27 || e.keyCode == 13) {
            Game.instance.setScreen(Menu);
          }
      }.bind(this)
    };

    this.drawHelp('Extras', [
      {name: 'Bomb', text: 'You can place an additional bomb'},
      {name: 'Power', text: 'Explosions grow one field in each direction'},
      {name: 'Skateboard', text: 'Lets you move faster'},
      {name: 'Kick', text: 'Kick bombs if you walk against one'},
      {name: 'Throw', text: 'Throw Bombs if you press the button twice without moving'}
    ], 'extras');

    this.drawHelp('Drugs', [
      {name: 'Joint', text: 'Controller will be reversed'},
      {name: 'Viagra', text: 'Autofire, this can be very dangerous!'},
      {name: 'Cocaine', text: 'Lets you move very fast!! (too fast)'}
    ], 'drugs');

    var anyKey = new Element("span").update("Press any key").setStyle({cursor: 'pointer'});
    anyKey.on('click', function() {Game.instance.setScreen(Menu)});
    this.container.appendChild(anyKey);
  },
  dispatch: function($super) {
    clearTimeout(this.timeout);
    this.container.update();
    $super();
  },
  drawHelp: function(name, items, cls) {
    this.container.appendChild(new Element('h1').update(name));

    var list = new Element('ul').addClassName(cls);
    $A(items).each(function(item) {
      var li = new Element('li').addClassName(item.name.toLowerCase());
      li.appendChild(new Element('img', {src: 'images/empty.gif'}));
      li.appendChild(new Element('span').update(item.name + ':'));
      li.appendChild(new Element('span').addClassName('text').update(item.text));
      li.appendChild(new Element('div').addClassName('clear'))

      this.appendChild(li);
    }.bind(list));
    this.container.appendChild(list);
  }
});
