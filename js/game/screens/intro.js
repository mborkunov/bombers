import Screen from 'babel!./screen';
import Menu from 'babel!./menu';
import Sound from 'babel!../../sound';

export default class extends Screen {

  constructor(container, callback) {
    super('intro', container);
    this.callback = callback;
    this.counter= 0;
    this.menu = null;
    this.rendered = false;
    this.opacity = 0;
    this.drawText = false;
    this.speed = 9;
    this.lastCall = 0;
    this.padding = 0;
    this.text = "A world domination project";
    this.init();

    this.listeners = {
      click: function(e) {
        if (this.timeout) clearTimeout(this.timeout);
        this.callback(Menu);
      }.bind(this),
      keydown: function(e) {
        if (!e.hasModifiers() && (e.keyCode == 27 || e.keyCode == 13)) {
          if (this.timeout) clearTimeout(this.timeout);
          this.callback(Menu);
        }
      }.bind(this)
    }
  }

  init() {
    this.padding = 0;
    Sound.play('winlevel');
    this.div = new Element('div').addClassName('content');
    this.div.appendChild(this.logo = new Element("div").addClassName("logo").setStyle({opacity: 0}));
    this.div.appendChild(this.textElement = new Element("div").addClassName("text").update(" "));

    this.container.appendChild(this.div);
  }

  dispatch() {
    this.div.remove();
  }

  update(delay) {
    if (this.drawText && !this.timeout) {
      var length = this.textElement.firstChild.nodeValue.length;
      if (length - 1 < this.text.length) {
        if ((now() - this.lastCall) >= 1000 / this.speed) {
          var c = this.text.charAt(length - 1);
          this.textElement.firstChild.nodeValue += c;
          if (c != ' ') {
            Sound.play('typewriter');
            this.lastCall = now();
          }
        }
      } else {
        Sound.play('menu_back');
        this.timeout = setTimeout(function() {
          this.callback(Menu);
        }.bind(this), 1000);
      }
    } else {
      if (this.opacity >= 1) {
        this.drawText = true;
      }
      if (this.timeout) {
        this.logo.style.setProperty('padding-bottom', this.padding + 'px', null);
        this.logo.style.setProperty('opacity', Math.max(0, 1 - this.padding * .01), null);
        this.textElement.style.setProperty('padding-top', this.padding + 'px', null);
        this.textElement.style.setProperty('opacity', Math.max(0, 1 - this.padding * .01), null);
        this.padding += 5;
      }
      this.opacity += 0.015;
    }
  }

  render() {
    if (this.opacity <= 1) {
      this.logo.setStyle({opacity: this.opacity});
    }
  }
}