import Point from 'babel!../../util/point';
import Config from 'babel!../../config';
import * as tiles from 'babel!../tiles';

export default class Map {

  constructor(name, author, maxPlayers, data) {
    this.name = name;
    this.author = author;
    this.maxPlayers = maxPlayers;
    if (data)
    this.entry = new Entry(data, this);
  }


  eachHandler(bomber) {
    if (bomber.isDead()) return;
    this.entry.highlightTile(bomber.location.x, bomber.location.y);
  }

  getAuthor() {
    return this.author;
  }

  getName() {
    return this.name;
  }

  highlight(bombers) {
    this.entry.clearHighlights();
    bombers.each(this.eachHandler.bind(this));
  }

  getPlayerStartupPositions() {
    return this.entry.getPlayerStartupPositions();
  }

  findTilesByType(type) {
    return this.entry.findTilesByType(type);
  }

  getRandomTile() {
    return this.entry.getRandomTile();
  }

  getRandomTileByType(type) {
    var entries = this.entry.findTilesByType(type);
    return entries[Math.floor(Math.random() * entries.length)];
  }

  getTile(x, y) {
    return this.entry.getTile(x, y);
  }

  getMaxPlayers() {
    return this.maxPlayers;
  }

  update(delay, shake) {
    this.entry.update(delay, shake);
  }

  prerender(container) {
    this.entry.prerender(container);
    container.appendChild(new Element("span").addClassName("map-name").update(this.getName().replace("_", " ")));
  }

  render(container, bombers) {
    if (Config.getValue('debug')) {
      this.highlight(bombers);
    }
    this.entry.render(container);
  }

  static load(name, callback) {
    if (name == "random") {
      return Map.getRandomMap(callback);
    }
    var location = 'maps/' + name + '.map';
    if (!Map._cache) Map._cache = {};
    var cachedMap = Map._cache[location];
    if (cachedMap) {
      if (callback) {
        callback(cachedMap);
        return;
      } else {
        return cachedMap;
      }
    }
    console.log('loading', location);
    new Ajax.Request(location, {
      method: 'get',
      onSuccess: function(r) {
        var content = r.responseText;
        var map = Map.parse(name, content);
        Map._cache[location] = map;
        if (callback) callback(map);
      },
      onFailure: function() {
        throw "cannot load map " + name;
      }
    });
    return new Map();
  }

  static parse(name, content) {
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
    return new Map(name, author, maxPlayers, data);
  }

  static list() {
    return $A(['Bomb_Attack', 'Big_Standard','Blast_Matrix','Bloody_Ring','Boiling_Egg','Bomb_Attack',
     'Broken_Heart','Crammed','Death_Corridor','Dilemma','FearCircle',
     'FearCircle_Remix','FireWheels','Football','Four_Instance','GhostBear',
     'Hard_Work','Hole_Run','Huge_Standard','Juicy_Lucy','Kitchen','Meeting',
     'MungoBane','Obstacle_Race','Overkill','Prison_Cells','Redirection',
     'Sixty_Nine','Small_Standard','Snake_Race','Tiny_Standard','Whole_Mess']);
  }

  static getRandomMap(callback) {
    var maps = Map.list();
    var id = Math.floor(Math.random() * maps.length);

    Map.load(maps[id], callback);
  }
}

class Entry  {
  constructor(data, map) {
    this.data = data;
    this.tiles = [];
    this.playerPositions = [];
    this.renderHandler = function(tile, container) {
      try {
        if (tile.next != null) {
          tile = tile.next;
        }
        tile.render(container);
      } catch (e) {
        console.error(e);
      }
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
            tile = new tiles.Arrow(point, data[x][y]);
            break;
          case 'R':
            if (Math.round((Math.random() * 100)) % 3 == 0) {
              tile = new tiles.Box(point);
            } else {
              tile = new tiles.Ground(point);
            }
            break;
          case '1': case '2': case '3': case '4':
          case '5': case '6': case '7': case '0':
            this.playerPositions.push({number: data[x][y] | 0, point: point});
          case ' ':
            tile = new tiles.Ground(point);
            break;
          case '+':
            tile = new tiles.Box(point);
            break;
          case 'S':
            tile = new tiles.Ice(point);
            break;
          case 'o':
            tile = new tiles.Trap(point);
            break;
          case '*':
            tile = new tiles.Wall(point);
            break;
          default:
            tile = new tiles.None(point);
            break;
        }

        this.tiles[x][y] = tile;
        this.size.setY(y++);
      }
      this.size.setX(x++);
    }
  }

  clearHighlights() {
    this.each(function(tile) {
      if (tile && tile.element)
        tile.element.removeClassName("highlight");
    });
  }

  getTile(x, y) {
    var _x = Math.round(x), _y = Math.round(y);
    var tile = null;
    try {
      tile = this.tiles[_x][_y];
    } catch (e) {
      tile = new tiles.None(new Point(_x, _y));
    }
    if (Object.isUndefined(tile)) {
      tile = new tiles.None(new Point(_x, _y));
    }
    return tile.next ? tile.next : tile;
  }

  highlightTile(x, y) {
    this.getTile(x, y).highlight();
  }

  findTilesByType(type) {
    var tiles = [];
    this.each(function(tile) {
        if (tile instanceof type && !tile.isDestroyed()) {
          tiles.push(tile);
        }
    }.bind(this));
    return tiles;
  }

  getRandomTile() {
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
  }

  getPlayerStartupPositions() {
    return this.playerPositions;
  }

  hasTiles() {
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
  }

  each(callback, options) {
    options = options || {};
    for (var y = 0, yLength = this.tiles.length; y < yLength; y++)  {
      for (var x = 0, xLength = this.tiles[y].length; x < xLength; x++)  {
        if (this.tiles[y][x]) callback(this.tiles[y][x], options);
      }
    }
  }

  static updateHandler(tile, options) {
    if (tile == null) return;
    if (tile.next != null) {
      tile = tile.next;
    }
    tile.update(options.delay, options.shake);
  }

  update(delay, shake) {
    var options = {shake: shake, delay: delay};
    this.each(Entry.updateHandler, options);
  }

  prerender(container) {
    this.each(function(tile) {
      tile.prerender(container);
    }.bind(this));
  }

  render() {
    this.each(this.renderHandler);
  }
}