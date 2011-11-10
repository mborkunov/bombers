define('screens/players', ['screens/screen'], function() {
  Game.Screen.Players = Class.create(Game.Screen, {
    name: 'Players',
    rendered: null,
    players: null,
    escapeKeyElement: null,
    lastAction: null,
    angle: null,
    init: function() {
      this.rendered = false;
      this.lastAction = 0;
      this.angle = 0;
      this.listeners = {
        click: function(e) {
        },
        keydown: function(e) {
          if (this.keys.indexOf(e.keyCode) === -1) {
            this.keys.push(e.keyCode);
          }
          if (e.keyCode == 27 /*|| e.keyCode == 13*/) {
            Game.instance.setScreen(Game.Screen.Menu);
          }
        }.bind(this),
        keyup: function(e) {
          this.lastAction = 0;
          if (this.keys.indexOf(e.keyCode) !== -1) {
            this.keys = this.keys.without(e.keyCode);
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
      if (!this.playersTable) {
        return;
      }
      if (date() - this.lastAction > 100) {
        this.lastAction = date();
        var selectedRow = this.playersTable.select('tr.selected')[0];
        var nextRow;
        var player = selectedRow.player;
        if (this.keys.indexOf(Event.KEY_UP) >= 0) {
          this.angle = 0;
          selectedRow.select('td.preview > .bomber')[0].rotate(0);
          selectedRow.removeClassName('selected');
          if (selectedRow.previousSibling) {
            selectedRow.previousSibling.addClassName('selected');
            nextRow = selectedRow.previousSibling;
          } else {
            selectedRow.parentNode.lastChild.addClassName('selected');
            nextRow = selectedRow.parentNode.lastChild;
          }
        } else if (this.keys.indexOf(Event.KEY_DOWN) >= 0) {
          this.angle = 0;
          selectedRow.select('td.preview > .bomber')[0].rotate(0);
          selectedRow.removeClassName('selected');
          if (selectedRow.nextSibling) {
            nextRow = selectedRow.nextSibling;
            selectedRow.nextSibling.addClassName('selected');
          } else {
            nextRow = selectedRow.parentNode.firstChild;
            selectedRow.parentNode.firstChild.addClassName('selected');
          }
        }
        if (nextRow) {
          var index = $A(selectedRow.childNodes).indexOf(selectedRow.select('td.selected')[0]);
          $A(nextRow.childNodes).each(function(cell) {
            cell.removeClassName('selected');
          });
          nextRow.childNodes[index].addClassName('selected');
        }

        var selectedCell = selectedRow.select('td.selected')[0];
        if (this.keys.indexOf(Event.KEY_RIGHT) >= 0) {
          selectedCell.removeClassName('selected');
          if (selectedCell.nextSibling) {
            selectedCell.nextSibling.addClassName('selected');
          } else {
            selectedRow.firstChild.addClassName('selected');
          }
        } else if (this.keys.indexOf(Event.KEY_LEFT) >= 0) {
          selectedCell.removeClassName('selected');
          if (selectedCell.previousSibling) {
            selectedCell.previousSibling.addClassName('selected');
          } else {
            selectedRow.lastChild.addClassName('selected');
          }
        }

        if (this.keys.indexOf(32) >= 0) { // space
          selectedRow.toggleClassName('active');
          player.setValue('active', selectedRow.hasClassName('active') ? 'true' : 'false');
        }

        if (this.keys.indexOf(13) >= 0) { //
          console.log('enter');
        }
      }
      this.angle += 5;
      if (this.angle >= 360) {
        this.angle = 0;
      }
    },
    render: function(delay) {
      if (!this.rendered) {
        this.rendered = true;

        this.playersTable = new Element('table').addClassName('list');

        var thead = new Element('thead');
        thead.appendChild(new Element('td').update('Preview'));
        thead.appendChild(new Element('td').update('Eyes'));
        thead.appendChild(new Element('td').update('Color'));
        thead.appendChild(new Element('td').update('Name'));
        thead.appendChild(new Element('td').update('Team'));
        thead.appendChild(new Element('td').update('Controller'));

        var tbody = new Element('tbody');
        for (var i = 0, length = this.players.length; i < length; i++) {
          var player = this.players[i];
          var tr = new Element('tr').addClassName('player');
          tr.player = player;
          var active = player.getValue('active').toLowerCase();
          if (active == 'true' || active == '1') {
            tr.addClassName('active');
          }
          if (i == 0) {
            tr.addClassName('selected');
          }
          var preview = new Element('td').addClassName('preview');
          var bomber = new Element('div').addClassName('bomber');
          var eyes = new Element('div').addClassName('eyes').addClassName(player.getValue('eyes'));
          bomber.setStyle({'background-color': player.getValue('color')});
          bomber.appendChild(new Element('div').addClassName('hotspot').appendChild(eyes).parentNode);
          preview.appendChild(bomber);
          tr.appendChild(preview);
          tr.appendChild(new Element('td').addClassName('eyes').addClassName(player.getValue('eyes')));
          tr.appendChild(new Element('td').addClassName('color').setStyle({background: player.getValue('color')}).update(player.getValue('color')));
          tr.appendChild(new Element('td').addClassName('name').update(player.getValue('username')).addClassName('selected'));
          tr.appendChild(new Element('td').addClassName('team').addClassName('team-' + player.getValue('team')));
          tr.appendChild(new Element('td').addClassName('controller').addClassName(player.getValue('controller')));
          tbody.appendChild(tr);
        }
        this.playersTable.appendChild(thead);
        this.playersTable.appendChild(tbody);
        this.container.appendChild(this.playersTable);

        this.escapeKeyElement = new Element("span").addClassName("anykey").addClassName('escape').update("Press escape key to return to menu");
        this.escapeKeyElement.on('click', function() {
          Game.instance.setScreen(Game.Screen.Menu)
        });
        this.container.appendChild(this.escapeKeyElement);
      } else {
        this.playersTable.select('tbody > tr.selected > td.preview > .bomber')[0].rotate(this.angle);
      }
    }
  });
});
