define('screens/score', ['screens/screen'], function() {
  Game.Screen.Score = Class.create(Game.Screen, {
    name: 'Score',
    rendered: false,
    init: function() {
      this.listeners = {
        click: function(e) {
        },
        keydown: function(e) {
          if (e.keyCode == 27 || e.keyCode == 13) {
            Game.instance.setScreen(Game.Screen.Arena);
          }
        }.bind(this)
      };
    },
    prerender: function() {
      this.layer = new Element('div');
      this.container.appendChild(this.layer);
      var next = new Element("div").addClassName('next');
      next.appendChild(new Element("div").addClassName('sign').update('Next Map'));
      next.appendChild(new Element("div").addClassName('preview'));
      next.appendChild(new Element("div").addClassName('name').update('Hello World'));
      this.layer.appendChild(next);

      var anyKey = new Element("span").addClassName("anykey").update("Press any key");
      anyKey.on('click', function() {
        Game.instance.setScreen(Game.Screen.Arena)
      });
      this.layer.appendChild(anyKey);
    },
    dispatch: function($super) {
      this.layer.remove();
    },
    update: function(delay) {
    },
    render: function(delay) {
      if (!this.rendered) {
        this.rendered = true;
        this.prerender();
      }
    }
  });
});

