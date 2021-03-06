import Screen from 'babel!./screen';
import Menu from 'babel!./menu';

export default class Help extends Screen {
  constructor(container, callback) {
    super('help', container);
    this.listeners = {
      click: function(e) {
      },
      keydown: function(e) {
        if (e.keyCode == 27 || e.keyCode == 13) {
          callback(Menu);
        }
      }.bind(this)
    };

    this.helpContainer = new Element('div');
    this.container.appendChild(this.helpContainer);

    this.drawHelp('Extras', [
      {name: 'Bomb',       text: 'You can place an additional bomb'},
      {name: 'Power',      text: 'Explosions grow one field in each direction'},
      {name: 'Skateboard', text: 'Lets you move faster'},
      {name: 'Kick',       text: 'Kick bombs if you walk against one'},
      {name: 'Glove',      text: 'Throw Bombs if you press the button twice without moving'}
    ], 'extras');

    this.drawHelp('Drugs', [
      {name: 'Joint',      text: 'Controller will be reversed'},
      {name: 'Viagra',     text: 'AutoFire, this can be very dangerous!'},
      {name: 'Cocaine',    text: 'Lets you move very fast!! (too fast)'}
    ], 'drugs');

    var anyKey = new Element("span").addClassName("anykey").update("Press enter or escape to exit");
    anyKey.on('click', function() {
      callback(Menu)
    });
    this.helpContainer.appendChild(anyKey);
  }

  dispatch() {
    clearTimeout(this.timeout);
    this.helpContainer.remove();
  }

  drawHelp(name, items, cls) {
    this.helpContainer.appendChild(new Element('h1').update(name));

    var list = new Element('ul').addClassName(cls);
    $A(items).each(function(item) {
      var li = new Element('li').addClassName(item.name.toLowerCase());
      li.appendChild(new Element('img', {src: 'images/empty.gif'}).addClassName('extra'));
      li.appendChild(new Element('span').update(item.name + ':'));
      li.appendChild(new Element('span').addClassName('text').update(item.text));
      li.appendChild(new Element('div').addClassName('clear'));

      this.appendChild(li);
    }.bind(list));
    this.helpContainer.appendChild(list);
  }
}