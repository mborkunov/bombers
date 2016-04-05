import Screen from 'babel!./screen';
import Menu from 'babel!./menu';

export default class extends Screen {
  constructor(container, callback) {
    super('credits', container);
    this.callback = callback;
    this.counter = 0;
    this.stop = false;
    this.listeners = {
      mousewheel: function (e) {
        var delta = 5;
        this.margin += e.wheelDeltaY < 0 ? -delta : delta;
      }.bind(this),
      mousedown: function (e) {
        this.stop = true;
      }.bind(this),
      mouseup: function (e) {
        this.stop = false;
      }.bind(this),
      keydown: function (e) {
        if (!e.hasModifiers()) {
          //Game.instance.setScreen(Menu);
        }
        if (this.keys.indexOf(e.keyCode) === -1) {
          this.keys.push(e.keyCode);
        }
      }.bind(this),
      keyup: function (e) {
        if (this.keys.indexOf(e.keyCode) !== -1) {
          this.keys = this.keys.without(e.keyCode);
        }
        if (e.keyCode == 27 || e.keyCode == 13) {
          callback(Menu);
        }
      }.bind(this)
    };

    this.margin = container.getHeight();
    this.text = '<h1>ClanBomber Credits (Original)</h1><br/>' +
      '<h2>Game Design</h2>' +
      'Andreas Hundt<br/>' +
      'Denis Oliver Kropp<br/>' +
      '<br/>' +
      '<h2>Coding</h2>' +
      'Denis Oliver Kropp<br/>' +
      'Andreas Hundt<br/>' +
      'mass (network code and oza stuf)<br/>' +
      '<br/>' +
      '<h2>Graphics</h2>' +
      'Andreeshchev Eugeni<br/>' +
      'Denis Oliver Kropp<br/>' +
      'Andreas Hundt<br/>' +
      '<br/>' +
      '<h2>Thanks go out to:</h2>' +
      'Magnus Norddahl<br/>' +
      '(24h ClanLib support)<br/>' +
      'Fredrik Hallenberg<br/>' +
      '(Debian package maintainer)<br/>' +
      'non<br/>' +
      '(for creating horst (the guy to the left))<br/>' +
      'clanner and resix<br/>' +
      '(for creating maps and playing with us)<br/>' +
      'Ivar<br/>' +
      '(for creating maps)<br/>' +
      'Magnus Reftel<br/>' +
      '(disable shaky explosions patch)<br/>' +
      'the xtux creators<br/>' +
      '(for the original tux and bsd-devil graphics)<br/>' +
      'SuSE Linux AG<br/>' +
      '(for donating free SuSE Linux Professional packages)<br/>' +
      '<br/><br/>' +
      'Everyone else supporting this game...<br/>' +
      '... and playing it<br/>';

    this.div = new Element('div').update(this.text).setStyle({
      position: 'absolute',
      marginTop: this.margin + "px"
    }).addClassName('content');
    this.container.appendChild(this.div);
  }

  dispatch() {
    this.div.remove();
  }

  update(delay) {
    if (Math.abs(this.margin) - 180 > this.container.getHeight()) {
      this.callback(Menu);
    }

    if (this.stop) return;

    if (this.keys.indexOf(Event.KEY_UP) != -1) {
      this.margin += 5;
    } else if (this.keys.indexOf(Event.KEY_DOWN) != -1) {
      this.margin -= 5;
    } else if (this.keys.indexOf(Event.KEY_PAGEUP) != -1) {
      this.margin += 15;
    } else if (this.keys.indexOf(Event.KEY_PAGEDOWN) != -1) {
      this.margin -= 15;
    } else {
      this.margin -= 0.5;
    }
  }

  render(delay) {
    this.div.style.marginTop = parseInt(this.margin) + 'px';
  }
}
