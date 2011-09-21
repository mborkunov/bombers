define('tiles/map', [], function() {
  Game.Map = Class.create({
    name: null,
    entry: null,
    author: null,
    maxPlayers: -1,
    eachHandler: function(bomber) {
      if (bomber.isDead()) return;
      this.entry.highlightTile(bomber.location.getX(), bomber.location.getY());
    }.bind(this),
    initialize: function(name, author, maxPlayers, data) {
      this.name = name;
      this.author = author;
      this.maxPlayers = maxPlayers;
      if (data)
      this.entry = new Game.Map.Entry(data);
    },
    getAuthor: function() {
      return this.author;
    },
    getName: function() {
      return this.name;
    },
    highlight: function(bombers) {
      //this.entry.clearHighlights();
      bombers.each(this.eachHandler);
    },
    getPlayerStartupPositions: function() {
      return this.entry.getPlayerStartupPositions();
    },
    getRandomTile: function() {
      return this.entry.getRandomTile();
    },
    getTile: function(x, y) {
      return this.entry.getTile(x, y);
    },
    getMaxPlayers: function() {
      return this.maxPlayers;
    },
    update: function(delay, shake) {
      this.entry.update(delay, shake);
    },
    prerender: function(container) {
      this.entry.prerender(container);
      container.appendChild(new Element("span").addClassName("map-name").update(this.getName().replace("_", " ")));
    },
    render: function(container) {
      this.entry.render(container);
    }
  });

  Game.Map.Entry = Class.create({
    tiles: null,
    data: null,
    playerPositions: null,
    updateHandler: function(tile) {
      var delay = 10, shake = 0;
      if (tile.next != null) {
        tile = tile.next;
      }
      tile.update(delay, shake);
    }.bind(this),
    renderHandler: null,

    initialize: function(data) {
      this.data = data;
      this.tiles = [];
      this.playerPositions = [];
      this.renderHandler = function(tile, container) {
        if (tile.next != null) {
          tile = tile.next;
        }
        tile.render(container);
      }.bind(this);

      var x = 0, y;
      this.size = {
        x: 0, y: 0,
        setX: function(x) {
          if (this.x <= x) this.x = x + 1
        },
        setY: function(y) {
          if (this.y <= y) this.y = y + 1
        }
      };

      while (!Object.isUndefined(data[x])) {
        this.tiles[x] = [];
        y = 0;
        while (!Object.isUndefined(data[x][y])) {
          var tile = null;
          var point = new Point(x, y);
          switch (data[x][y]) {
            case '<':
            case '>':
            case 'v':
            case '^':
              tile = new Game.Tile.Arrow(point, data[x][y]);
              break;
            case 'R':
              if (Math.round((Math.random() * 100)) % 3 == 0) {
                tile = new Game.Tile.Box(point);
              } else {
                tile = new Game.Tile.Ground(point);
              }
              break;
            case '1': case '2': case '3': case '4':
            case '5': case '6': case '7': case '0':
            this.playerPositions.push({number: data[x][y] | 0, point: point});
            case ' ':
              tile = new Game.Tile.Ground(point);
              break;
            case '+':
              tile = new Game.Tile.Box(point);
              break;
            case 'S':
              tile = new Game.Tile.Ice(point);
              break;
            case 'o':
              tile = new Game.Tile.Trap(point);
              break;
            case '*':
              tile = new Game.Tile.Wall(point);
              break;
            default:
              tile = new Game.Tile.None(point);
              break;
          }

          this.tiles[x][y] = tile;
          this.size.setY(y++);
        }
        this.size.setX(x++);
      }
    },
    clearHighlights: function() {
      this.each(function(tile) {
        if (tile/* && tile.element*/)
          tile.element.removeClassName("highlight");
      });
    },
    getTile: function(x, y) {
      var _x = Math.round(x), _y = Math.round(y);
      var tile = null;
      try {
        tile = this.tiles[_x][_y];
      } catch (e) {
        tile = new Game.Tile.None(new Point(_x, _y));
      }
      if (Object.isUndefined(tile)) {
        tile = new Game.Tile.None(new Point(_x, _y));
      }
      return tile.next ? tile.next : tile;
    },
    highlightTile: function(x, y) {
      this.getTile(x, y).highlight();
    },
    getRandomTile: function() {
      var x = Math.floor(Math.random() * this.size.x);
      var y = Math.floor(Math.random() * this.size.y);

      try {
        var tile = this.getTile(x, y);
        return (tile.isVanishing() || tile.isDestroyed() || tile.getName() == 'none') ? this.getRandomTile() : tile;
      } catch (e) {
        if (this.hasTiles()) {
          return this.getRandomTile();
        }
        return null;
      }
    },
    getPlayerStartupPositions: function() {
      return this.playerPositions;
    },
    hasTiles: function() {
      var x = 0, y = 0;
      for (var y = 0, yLength = this.tiles.length; y < yLength; y++)  {
        for (var x = 0, xLength = this.tiles[y].length; x < xLength; x++)  {
          var tile = this.tiles[y][x];
          tile = tile.next ? tile.next : tile;
          if (tile.getName() != 'none' && !tile.isDestroyed() && !tile.isVanishing()) {
            return true;
          }
        }
      }
      return false;
    },
    each: function(callback) {
      for (var y = 0, yLength = this.tiles.length; y < yLength; y++)  {
        for (var x = 0, xLength = this.tiles[y].length; x < xLength; x++)  {
          callback(this.tiles[y][x]);
        }
      }
    },
    update: function(delay, shake) {
      this.each(this.updateHandler);
    },
    prerender: function(container) {
      this.each(function(tile) {
        tile.prerender(container);
      }.bind(this));
    },
    render: function() {
      this.each(this.renderHandler);
    }
  });

  Object.extend(Game.Map, {
    extension: '.map',
    load: function(name, callback) {
      console.log('loading', 'maps/' + name + this.extension);
      new Ajax.Request('maps/' + name + '.map', {
        method: 'get',
        onSuccess: function(r) {
          var content = r.responseText;
          var map = Game.Map.parse(name, content);
          if (callback) callback(map);
        },
        onFailure: function() {
          throw new String("cannot load map " + name);
        }
      });
      return new Game.Map();
    },
    parse: function(name, content) {
      var lineSeparator = String.fromCharCode(0x0A)[0];
      var lines = content.split(lineSeparator);

      var author = lines[0];
      var maxPlayers = parseInt(lines[1]);

      var x = 0, y = 0;

      var data = [];

      for (var i = 2, length = lines.length; i < length; i++,x++) {
        var line = lines[i];
        y = 0;

        for (var j = 0, len = line.length; j < len; j++,y++) {
          if (Object.isUndefined(data[y])) {
            data[y] = {};
          }
          data[y][x] = line.charAt(j);
        }
      }
      return new Game.Map(name, author, maxPlayers, data);
    }
  });
});
