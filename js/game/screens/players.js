define('screens/players', ['screens/screen'], function() {
  Game.Screen.Players = Class.create(Game.Screen, {
    name: 'Players',
    rendered: null,
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

        for (var i = 0; i < 8; i++) {
          var tr = new Element('tr');
          tr.appendChild(new Element('td').update('img'));
          tr.appendChild(new Element('td').update('Are you'));
          tr.appendChild(new Element('td').update('Team'));
          tr.appendChild(new Element('td').update('Controller'));
          tbody.appendChild(tr);
        }
        this.playersTable.appendChild(tbody);
        this.container.appendChild(this.playersTable);
      }
    }
  });
});
