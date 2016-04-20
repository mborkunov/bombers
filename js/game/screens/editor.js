import Screen from 'babel!./screen';
import Arena from 'babel!./arena';
import Menu from 'babel!./menu';
import Config from 'babel!../../config';

export default class Editor extends Screen {

  constructor(container, callback) {
    super('editor', container);
    this.callback = callback;
    this.keys = [];
    this.listeners = {
      click: function() {
      },
      keydown: function(e) {
        if (e.keyCode == 27 || e.keyCode == 13) {
          callback(Menu);
        }
        if (this.keys.indexOf(e.keyCode) < 0) {
          this.keys.push(e.keyCode);
        }
      }.bind(this),
      keyup: function(e) {
        if (this.keys.indexOf(e.keyCode) !== -1) {
          this.keys = this.keys.without(e.keyCode);
        }
      }.bind(this)
    };
    if (!Config.getValue('debug')) {
      document.onmousedown = function() {return true}; // enable text selection - chromium
      document.oncontextmenu = function() {return true}; // enable context menu
    }
    this.selected = null;
    this.mapName = '_';
    this.author = 'Guest';
    this.playersNumber = 0;
    this.spawnedPlayers = 0;
    this.initData(16, 12);
  }

  initData(x, y) {
    this.size = {x: x, y: y};
    this.data = [];
    for (var i = 0; i < this.size.y; i++) {
      this.data.push([]);
      for (var j = 0; j < this.size.x; j++) {
        this.data[i].push(' ');
      }
    }
  }

  dispatch() {
    this.preview && this.preview.remove();
    this.toolbox && this.toolbox.remove();
    if (!Config.getValue('debug')) {
      document.onmousedown = function() {return false}; // enable text selection - chromium
      document.oncontextmenu = function() {return false}; // enable context menu
    }
  }

  update() {
  }

  render(delay) {
    if (!this.rendered) {
      this.rendered = true;
      this.prerender();
    } else {

    }
  }

  prerender() {
    this.preview = new Element('div').addClassName('preview');
    this.toolbox = new Element('div').addClassName('toolbox');

    this.properties = new Element('div').addClassName('properties');
    this.tilesBox = new Element('div').addClassName('tiles');
    this.properties.appendChild(new Element('h2').addClassName('title').update('Properties'));

    this.properties.appendChild(new Element('label', {'for': 'map_name'}).addClassName('name').update('Map name:'));
    this.properties.appendChild(new Element('br'));
    this.mapNameElement = new Element('input', {id: 'map_name'}).addClassName('name');
    this.properties.appendChild(this.mapNameElement);
    this.properties.appendChild(new Element('br'));
    this.properties.appendChild(new Element('label', {'for': 'map_author'}).addClassName('name').update('Author:'));
    this.properties.appendChild(new Element('br'));
    this.authorElement = new Element('input', {value: this.author, id: 'map_author'}).addClassName('author');
    this.properties.appendChild(this.authorElement);
    this.properties.appendChild(new Element('br'));

    this.properties.appendChild(new Element('label', {'for': 'map_players'}).addClassName('name').update('Players'));
    this.properties.appendChild(new Element('br'));
    this.players = new Element('select', {id: 'map_players'});
    this.properties.appendChild(this.players);
    for (var p = 2; p <= 8; p++) {
      this.players.appendChild(new Element('option').update(p));
    }
    this.properties.appendChild(new Element('br'));

    this.properties.appendChild(new Element('label').addClassName('name').update('Map size'));
    this.properties.appendChild(new Element('br'));
    this.xAxis = new Element('select');
    this.properties.appendChild(this.xAxis);
    for (var x = 4; x <= 16; x++) {
      this.xAxis.appendChild(new Element('option').update(x));
    }

    this.yAxis = new Element('select');
    this.properties.appendChild(this.yAxis);
    for (var y = 4; y <= 16; y++) {
      this.yAxis.appendChild(new Element('option').update(y));
    }
    document.body.observe('mousedown', function() {
      this.pressed = true;
    }.bind(this));
    document.body.observe('mouseup', function() {
      this.pressed = false;
    }.bind(this));

    this.properties.appendChild(new Element('br'));
    this.properties.appendChild(new Element('br'));

    this.properties.appendChild(new Element('button').update('Apply').observe('click', this.onPropertyChanged.bind(this)));
    this.properties.appendChild(new Element('br'));

    this.tilesBox.appendChild(new Element('h2').addClassName('title').update('Tiles'));

    this.tiles = [];
    this.tiles.push(['*', 'wall']);
    this.tiles.push(['+', 'box']);
    this.tiles.push(['S', 'ice']);
    this.tiles.push(['o', 'trap']);
    this.tiles.push([' ', 'ground']);
    this.tiles.push(['^', 'arrow north']);
    this.tiles.push(['<', 'arrow west']);
    this.tiles.push(['v', 'arrow south']);
    this.tiles.push(['>', 'arrow east']);
    this.tiles.push(['-', 'none']);
    this.tiles.push(['1', 'ground spawn']);

    this.tiles.forEach(function(item) {
      var element = new Element('div', {'data-character': item[0]}).addClassName('tile').addClassName(item[1]);
      element.observe('mousedown', function(e) {
        if (this.selected !== null) {
          if (this.selected[1].indexOf(' ') >= 0) {
            var classes = this.selected[1].split(' ').join('.');
            this.tilesBox.select('.' + classes)[0].classList.remove('selected');
          } else {
            this.tilesBox.select('.' + this.selected[1])[0].classList.remove('selected');
          }
        }
        this.selected = item;
        e.element().addClassName('selected');
      }.bind(this));

      this.tilesBox.appendChild(element);
    }.bind(this));

    this.tilesBox.appendChild(new Element('div').addClassName('clear'));

    this.tilesBox.appendChild(new Element('button').addClassName('action').update('Fill').observe('click', this.fill.bind(this)));
    this.tilesBox.appendChild(new Element('button').addClassName('action').update('Clear').observe('click', this.clear.bind(this)));


    this.preview.observe('mouseover', function() {
      document.onmousedown = function() {return false}; // enable text selection - chromium
      document.getSelection().removeAllRanges();
    });
    this.preview.observe('mouseout', function() {
      document.onmousedown = function() {return true}; // enable text selection - chromium
    });

    this.toolbox.appendChild(this.properties);
    this.toolbox.appendChild(this.tilesBox);

    this.actionsBox  = new Element('div').addClassName('actions');
    this.actionsBox.appendChild(new Element('h2').addClassName('title').update('Actions'));

    this.actionsBox.appendChild(new Element('button').addClassName('action').update('Save').observe('click', this.save.bind(this)));
    this.actionsBox.appendChild(new Element('button').addClassName('action').update('Download').observe('click', this.download.bind(this)));
    this.actionsBox.appendChild(new Element('button').addClassName('action').update('Play').observe('click', this.play.bind(this)));
    /*this.actionsBox.appendChild(new Element('button').addClassName('action').update('todo:').observe('click', this.upload.bind(this)));
    this.actionsBox.appendChild(new Element('button').addClassName('action').update('Email').observe('click', this.email.bind(this)));*/


    this.toolbox.appendChild(this.actionsBox);
    this.container.appendChild(this.preview);
    this.container.appendChild(this.toolbox);

    this.area = new Element('div').addClassName('area');
    if (Config.getValue('graphic.shadows')) {
      this.area.addClassName('shadows');
    }
    this.preview.appendChild(this.area);

    for (var i = 0; i < this.size.y; i++) {
      for (var j = 0; j < this.size.x; j++) {
        this.area.appendChild(this.createTile(j, i));
      }
    }
    this.alignArea();
  }

  createTile(x, y) {
    var tile = new Element('div', {id: x + 'x' + y}).addClassName('tile none');
    tile.observe('mousedown', function(e) {
      this.pressed = true;
      if (this.selected) {
        var loc = e.element().getAttribute('id').split('x');
        this.setTile(parseInt(loc[0]), parseInt(loc[1]), this.selected);
      }
    }.bind(this));
    tile.observe('mouseup', function(e) {
      this.pressed = false;
    }.bind(this));
    tile.observe('mouseover', function(e) {
      if (this.pressed && this.selected) {
        var loc = e.element().getAttribute('id').split('x');
        this.setTile(parseInt(loc[0]), parseInt(loc[1]), this.selected);
      }
    }.bind(this));

    tile.observe('mouseout', function(e) {
    }.bind(this));

    tile.setStyle({
      top: (y * 40) + 'px',
      left: (x * 40) + 'px'
    });
    return tile;
  }

  setTile(x, y, tile) {
    var id = x + 'x' + y;
    var element = $(id);
    element.className = 'tile';
    element.addClassName(tile[1]);
    this.data[y][x] = tile[0];
/*

      var currentValue = this.data[y][x];
      var newValue = this.tileNameToChar(tile);
      if (parseInt(currentValue) == 0) {
        if (parseInt(newValue) > 0) {
          this.spawnedPlayers++;
        }
      } else {
        if (parseInt(newValue) == 0) {
          this.spawnedPlayers--;
        }
      }
      this.data[y][x] = newValue;
    }*/
  }

  onPropertyChanged() {
    console.log('changed');
    this.mapName = '_';
    this.author = '';
    this.playersNumber = 5;
    this.clearPreview();
    this.resize(this.xAxis.value, this.yAxis.value);
    console.log(this.xAxis.value, this.yAxis.value);

    //this.initData(10, 12);
  }

  clearPreview() {
    this.eachTile(function(tile) {
      if (tile) {
        tile.remove();
      }
    });
  }

  resize(x, y) {
    this.clearPreview();
    this.size = {x:x, y:y};
    for (var i = 0; i < y; i++) {
      for (var j = 0; j < x; j++) {
        var tile = this.createTile(j, i);
        this.area.appendChild(tile);
      }
    }
    this.alignArea();
    this.drawData();
    this.initData(this.size.x, this.size.y);
  }

  drawData() {
    for (var i = 0; i < this.size.y; i++) {
      for (var j = 0; j < this.size.x; j++) {
        //this.setTile(j, i, this.data[i][j]);
      }
    }
  }

  alignArea() {
    this.area.setStyle({
      'margin-top': '-' + this.size.y * 20 + 'px',
      'margin-left': '-' + this.size.x * 20 + 'px',
      width: this.size.x * 40 + 'px',
      height: this.size.y * 40 + 'px'
    });
    if (this.size.x >= 14 || this.size.y >= 14) {
      this.area.scale(.8);
    } else {
      this.area.scale(1);
    }
  }

  clear() {
    this.initData(this.size.x, this.size.y);
    this.eachTile(function(element) {
      element.className = 'tile none';
    });
  }

  fill() {
    if (this.selected) {
      this.initData(this.size.x, this.size.y);
      this.eachTile(function(element) {
        element.className = 'tile ' + this.selected[1];
        console.log('tile ' + this.selected);
      }.bind(this));
    }
  }

  eachTile(callback) {
    for (var y = 0; y < this.size.y; y++) {
      for (var x = 0; x < this.size.x; x++) {
        callback($(x +'x' + y));
      }
    }
  }

  play() {
    this.save();
    this.callback(Arena, 'map.' + this.getMapName());
  }

  download() {
    var bb = new BlobBuilder;
    bb.append(this.serialize());
    saveAs(bb.getBlob('text/plain;charset=utf-8'), this.getMapName() + '.map');
  }

  getMapName() {
    this.mapName = this.mapNameElement.value;
    return this.mapName;
  }

  getAuthor() {
    this.author = this.authorElement.value;
    return this.author;
  }

  serialize() {
    var result = '';
    result += this.getAuthor() + '\n';
    result += this.playersNumber + '\n';

    for (var y = 0; y < this.size.y; y++) {
      for (var x = 0; x < this.size.x; x++) {
        result += this.data[y][x];
      }
      if (y + 1 < this.size.y) {
        result+= '\n';
      }
    }
    return result;
  }

  save() {
    var key = 'map.' + this.getMapName();
    localStorage.setItem(key, JSON.stringify(this.serialize()));
    let maps = [];
    var list = localStorage.getItem('maps');
    if (list) {
      maps = JSON.parse(list);
    }
    if (maps.indexOf(key) < 0) {
      maps.push(key);
    }
    localStorage.setItem('maps', JSON.stringify(maps));
  }

  validate() {
    return true;
  }
}