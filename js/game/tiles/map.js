var Map = Class.create({
  name: null,
  entry: null,
  author: null,
  maxPlayers: -1,
  
  initialize: function(name, author, maxPlayers, entry) {
    this.name = name;
    this.author = author;
    this.maxPlayers = maxPlayers;
    this.entry = entry;
  },
  
  getAuthor: function() {
    return this.author;
  },
  getName: function() {
    return this.name;
  },
  addBomb: function() {
    
  },
  getRandomTile: function() {
    return this.entry.getRandomTile();
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

Map.Entry = Class.create({
  tiles: null,
  data: null,

  initialize: function(data) {
    this.data = data;
    this.tiles = {};
    
    var x = 0, y;
    this.size = {
      x: 0, y: 0,
      setX: function(x) {if (this.x <= x) this.x = x + 1},
      setY: function(y) {if (this.y <= y) this.y = y + 1}
    };

    while (typeof data[x] != 'undefined') {
      this.tiles[x] = {};
      y = 0;
      while (typeof data[x][y] != 'undefined') {      
        var tile = null;
        
        switch (data[x][y]) {
          case '<':
          case '>':
          case 'v':
          case '^':
            tile = new Tile.Arrow(x, y, data[x][y]);
            break;
          case 'R':
            if (Math.round((Math.random() * 100)) % 3 == 0) {
              tile = new Tile.Box(x, y);
            } else {
              tile = new Tile.Ground(x, y);
            }
            break;
          case '1': case '2': case '3': case '4':
          case '5': case '6': case '7': case '0':
          case ' ':
            tile = new Tile.Ground(x, y);
            break;
          case '+':
            tile = new Tile.Box(x, y);
            break;
          case 'S':
            tile = new Tile.Ice(x, y);
            break;
          case 'o':
            tile = new Tile.Trap(x, y);
            break;
          case '*':
            tile = new Tile.Wall(x, y);
            break;
          default:
            tile = new Tile.None(x, y);
            break;
        }
        
        this.tiles[x][y] = tile;
        this.size.setY(y++);
      }
      this.size.setX(x++);
    }
    console.log(this.size.x + "x" + this.size.y);
  },
  getRandomTile: function() {
    var x = Math.floor(Math.random() * this.size.x);
    var y = Math.floor(Math.random() * this.size.y);

    try {
      var tile = this.tiles[x][y].next ? this.tiles[x][y].next : this.tiles[x][y];
      return (tile.isVanishing() || tile.isDestroyed() || tile.getName() == 'none') ? this.getRandomTile() : tile;
    } catch (e) {
      if (this.hasTiles()) {
        return this.getRandomTile();
      }
      return null;
    }
  },
  hasTiles: function() {
    var x = 0, y = 0;
    while (typeof this.tiles[y] != 'undefined') {
      x = 0;
      while (typeof this.tiles[y][x] != 'undefined') {
        var tile = this.tiles[y][x++];;
        tile = tile.next ? tile.next : tile;
        if (tile.getName() != 'none' && !tile.isDestroyed() && !tile.isVanishing()) {
          return true;
        }
      }
      y++;
    }
    return false;
  },
  each: function(callback) {
    var x = 0, y = 0;
    while (typeof this.tiles[y] != 'undefined') {
      x = 0;
      while (typeof this.tiles[y][x] != 'undefined') {
        callback(this.tiles[y][x++]);
      }
      y++;
    }      
  },
  update: function(delay, shake) {
    this.each(function(tile) {
      if (tile.next != null) {
        tile = tile.next;
      }
      tile.update(delay, shake);
    }.bind(this));
  },
  prerender: function(container) {
    this.each(function(tile) {
      tile.prerender(container);
    }.bind(this));
  },
  render: function(container) {
    this.each(function(tile) {
      if (tile.next != null) {
        tile = tile.next;
      }
      tile.render(container);
    }.bind(this));
  }
});

Object.extend(Map, {
  extension: '.map',
  load: function(name, callback) {
    console.log('loading', 'maps/' + name + this.extension);
    new Ajax.Request('maps/' + name + '.map', {
      onSuccess: function(r) {
        var content = r.responseText;
        var map = Map.parse(name, content);
        if (callback) callback(map);
      },
      onFailure: function() {
        throw new String("cannot load map " + name);
      }
    });
    return new Map();
  },
  parse: function(name, content) {
    var lineSeparator = String.fromCharCode(0x0A)[0];
    var lines = content.split(lineSeparator);
    
    var author = lines[0];
    var maxPlayers = parseInt(lines[1]);
    
    var x = 0, y = 0;
    
    var data = {};

    for (var i = 2, length = lines.length; i < length; i++, x++) {
      var line = lines[i];
      y = 0;

      for (var j = 0, len = line.length; j < len; j++, y++) {
        if (typeof data[y] == 'undefined') {
          data[y] = {};
        }
        data[y][x] = line.charAt(j);
      }
    }
    return new Map(name, author, maxPlayers, new Map.Entry(data));
  }
});
