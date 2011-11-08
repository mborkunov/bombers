define('screens/players', ['screens/screen'], function() {
  Game.Screen.Players = Class.create(Game.Screen, {
    name: 'Players',
    rendered: null,
    players: null,
    init: function() {
      this.rendered = false;
      this.listeners = {
        click: function(e) {
        },
        keydown: function(e) {
          if (e.keyCode == 27 || e.keyCode == 13) {
            Game.instance.setScreen(Game.Screen.Menu);
          }
        }.bind(this)
      };
      this.players = Config.Players.getAllPlayers();
    },
    dispatch: function($super) {
      this.playersTable.remove();
    },
    update: function(delay) {
    },
    render: function(delay) {
      if (!this.rendered) {
        this.rendered = true;

        this.playersTable = new Element('table').addClassName('list');

        var tbody = new Element('tbody');
        for (var i = 0, length = this.players.length; i < length; i++) {
          var player = this.players[i];
          var tr = new Element('tr').addClassName('player');
          if (i == 4) {
            tr.addClassName('selected');
          }
          tr.appendChild(new Element('td').addClassName('preview'));
          tr.appendChild(new Element('td').addClassName('name').update(player.getValue('username')));
          tr.appendChild(new Element('td').addClassName('team'));
          tr.appendChild(new Element('td').addClassName('controller'  ).addClassName(player.getValue('controller')));
          tbody.appendChild(tr);
        }
        this.playersTable.appendChild(tbody);
        this.container.appendChild(this.playersTable);
      }
    }
  });
});
