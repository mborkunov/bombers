import Screen from 'babel!./screen';
import Arena from 'babel!./arena';
import Map from 'babel!../tiles/map';

export default class Score extends Screen {
    constructor(container, callback) {
      super('score', container);
      this.callback = callback;
      this.listeners = {
        click: function(e) {
        },
        keydown: function(e) {
          if (e.keyCode == 27 || e.keyCode == 13) {
            callback(Arena);
          }
        }.bind(this)
      };
    }

    prerender() {
      this.layer = new Element('div');

      this.container.appendChild(this.layer);

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
          playerElement.addClassName('winner');
          playerElement.appendChild(new Element('div').addClassName('cup'));
        }
        playersList.appendChild(playerElement);
      }

      this.layer.appendChild(playersList);

      var next = new Element("div").addClassName('next');
      next.appendChild(new Element("div").addClassName('sign').update('Next Map: ---'));
      next.appendChild(new Element('div').addClassName('preview').addClassName('loading'));

      this.layer.appendChild(next);
      Map.getRandomMap(function(next, map) {
        var preview = next.select('.preview')[0];
        map.prerender(preview);
        next.select('.sign')[0].update('Next Map: ' +  map.name.replace("_", " "));
        preview.removeClassName('loading');
      }.bind(this, next));

      var anyKey = new Element("span").addClassName("anykey").update("Press enter or escape");
      anyKey.on('click', function() {
        this.callback(Arena);
      });
      this.layer.appendChild(anyKey);
    }

    dispatch() {
      this.layer.remove();
    }

    update(delay) {
    }

    render(delay) {
      if (!this.rendered) {
        this.rendered = true;
        this.prerender();
      }
    }
}