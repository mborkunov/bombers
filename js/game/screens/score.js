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

      var players = [{
        number: 1,
        winner: true,
        team: null,
        ai: true
      }, {
        number: 2,
        winner: false,
        team: null
      }, {
        number: 3,
        winner: true,
        team: null
      }, {
        number: 4,
        winner: false,
        team: null
      },
      {
        number: 5,
        winner: false,
        team: null
      },{
        number: 6,
        winner: false,
        team: null
      },{
        number: 7,
        winner: false,
        team: null
      },{
        number: 8,
        winner: false,
        team: null
      }];

      var playersList = new Element('div').addClassName('list');
      for (var i = 0, length = players.length; i < length; i++) {
        var player = players[i];

        var playerElement = new Element('div').addClassName('player');
        if (player.winner) {
          playerElement.addClassName('winner')
          playerElement.appendChild(new Element('div').addClassName('cup'));
        }
        playersList.appendChild(playerElement);
      }

      this.layer.appendChild(playersList);

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

