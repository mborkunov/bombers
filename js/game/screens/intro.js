define('screens/intro', ['screens/screen'], function() {
  Game.Screen.Intro = Class.create(Game.Screen, {
    counter: 0,
    name: 'Intro',
    menu: null,
    rendered: false,
    opacity: 0,
    introElement: null,
    drawText: false,
    speed: 9,
    lastCall: 0,
    text: "A world domination project",
    init: function() {
      this.listeners = {
        click: function(e) {
          if (this.timeout) clearTimeout(this.timeout);
          Game.instance.setScreen(Game.Screen.Menu);
        }.bind(this),
        keydown: function(e) {
          if (!e.hasModifiers() && (e.keyCode == 27 || e.keyCode == 13)) {
            if (this.timeout) clearTimeout(this.timeout);
            Game.instance.setScreen(Game.Screen.Menu);
          }
        }.bind(this)
      };
      Sound.play('winlevel');
      this.div = new Element('div');
      this.div.appendChild(this.logo = new Element("div").addClassName("logo").setStyle({opacity: 0}));
      this.div.appendChild(this.textElement = new Element("div").addClassName("text").update(" "));

      this.container.appendChild(this.div);
    },
    dispatch: function($super) {
      this.div.remove();
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
          this.logo.setStyle({
            'width': parseInt(this.logo.getStyle('width')) + 1 + 'px'
          });
          this.textElement.setStyle({
            'margin-top': this.textElement.getStyle('margin-top') | 0 + 5 + 'px'
          });
          Sound.play('menu_back');
          this.timeout = setTimeout(function() {
            console.log('intro set screen');
            Game.instance.setScreen(Game.Screen.Menu);
          }, 2500);
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

});
