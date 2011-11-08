define('screens/players', ['screens/screen'], function() {
  Game.Screen.Players = Class.create(Game.Screen, {
    name: 'Players',
    rendered: null,
    players: null,
    escapeKeyElement: null,
    init: function() {
      this.rendered = false;
      this.listeners = {
        click: function(e) {
        },
        keydown: function(e) {
          if (e.keyCode == 27 /*|| e.keyCode == 13*/) {
            Game.instance.setScreen(Game.Screen.Menu);
          }

          var selectedRow = this.playersTable.select('tr.selected')[0];
          if (e.keyCode == Event.KEY_UP) {
            selectedRow.removeClassName('selected');
            if (selectedRow.previousSibling) {
              selectedRow.previousSibling.addClassName('selected');
            } else {
              selectedRow.parentNode.lastChild.addClassName('selected');
            }
          } else if (e.keyCode == Event.KEY_DOWN) {
            selectedRow.removeClassName('selected');
            if (selectedRow.nextSibling) {
              selectedRow.nextSibling.addClassName('selected');
            } else {
              selectedRow.parentNode.firstChild.addClassName('selected');
            }
          }
          var selectedCell = selectedRow.select('td.selected')[0];
          if (e.keyCode == Event.KEY_RIGHT) {
            selectedCell.removeClassName('selected');
            if (selectedCell.nextSibling) {
              selectedCell.nextSibling.addClassName('selected');
            } else {
              selectedRow.firstChild.addClassName('selected');
            }
          } else if (e.keyCode == Event.KEY_LEFT) {
            selectedCell.removeClassName('selected');
            if (selectedCell.previousSibling) {
              selectedCell.previousSibling.addClassName('selected');
            } else {
              selectedRow.lastChild.addClassName('selected');
            }
          }

          if (e.keyCode == 32) {
            selectedRow.toggleClassName('active');
          }
        }.bind(this)
      };
      this.players = Config.Players.getAllPlayers();
    },
    dispatch: function($super) {
      this.playersTable.remove();
      this.escapeKeyElement.remove();
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
          var active = player.getValue('active').toLowerCase();
          if (active == 'true' || active == '1') {
            tr.addClassName('active');
          }
          if (i == 0) {
            tr.addClassName('selected');
          }
          tr.appendChild(new Element('td').addClassName('preview'));
          tr.appendChild(new Element('td').addClassName('name').update(player.getValue('username')).addClassName('selected'));
          tr.appendChild(new Element('td').addClassName('team'));
          tr.appendChild(new Element('td').addClassName('controller'  ).addClassName(player.getValue('controller')));
          tbody.appendChild(tr);
        }
        this.playersTable.appendChild(tbody);
        this.container.appendChild(this.playersTable);

        this.escapeKeyElement = new Element("span").addClassName("anykey").addClassName('escape').update("Press escape key to return to menu");
        this.escapeKeyElement.on('click', function() {
          Game.instance.setScreen(Game.Screen.Menu)
        });
        this.container.appendChild(this.escapeKeyElement);
      }
    }
  });
});
