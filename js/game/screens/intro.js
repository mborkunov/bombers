var Intro = Class.create(Screen, {
  counter: 0,
  name: 'Intro',
  menu: null,
  rendered: false,
  opacity: 0,
  introElement: null,
  drawText: false,
  speed: 10,
  lastCall: 0,
  text: "A world domination project",
  init: function() {
    this.listeners = {
      click: function(e) {
        if (this.timeout) clearTimeout(this.timeout);
        Game.instance.setScreen(Menu);
      }.bind(this),
      keydown: function(e) {
        if (!e.hasModifiers()) {
          if (this.timeout) clearTimeout(this.timeout);
          Game.instance.setScreen(Menu);
        }
      }.bind(this)
    };
    Sound.play('winlevel');

    this.container.appendChild(this.logo = new Element("div").addClassName("logo").setStyle({opacity: 0}));
    this.container.appendChild(this.textElement = new Element("div").addClassName("text").update(" "));
  },
  dispatch: function($super) {
    $super();
  },
  update: function(delay) {
    if (this.drawText && !this.timeout) {
      var length = this.textElement.firstChild.nodeValue.length;
      if (length - 1 < this.text.length) {
        if ((date() - this.lastCall) >= 1000 / this.speed) {
          var c = this.text.charAt(length - 1);
          this.textElement.firstChild.nodeValue += c;
          if (c != ' ') {
            Sound.play('typewriter');
            this.lastCall = date();
          }
        }
      } else {
        Sound.play('menu_back');
        this.timeout = setTimeout(function() {Game.instance.setScreen(Menu)}, 2500);
      }
    } else {
      if (this.opacity >= 1) {
        this.drawText = true;
      }
      this.opacity += 0.015;
    }
  },
  render: function(time) {
    if (this.opacity <= 1) {
      this.logo.setStyle({opacity: this.opacity});
    }
  }
});
